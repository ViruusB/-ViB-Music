const { Util, MessageEmbed } = require('discord.js');
const ytdl = require('ytdl-core');
const yts = require('yt-search');
const ytdlDiscord = require('ytdl-core-discord');
const YouTube = require('youtube-sr');
const sendError = require('../util/error');
const fs = require('fs');

module.exports = {
  info: {
    name: 'search',
    description: 'Pour chercher une musique.',
    usage: '<nom_musique>, <nom_artiste>',
    aliases: ['sc'],
  },

  run: async function (client, message, args) {
    let channel = message.member.voice.channel;
    if (!channel)
      return sendError(
        'Je suis désolé mais vous devez être dans un canal vocal pour écouter de la musique !',
        message.channel
      );

    const permissions = channel.permissionsFor(message.client.user);
    if (!permissions.has('CONNECT'))
      return sendError(
        'Je ne parviens pas à me connecter à votre canal vocal, assurez-vous que je dispose des autorisations appropriées !',
        message.channel
      );
    if (!permissions.has('SPEAK'))
      return sendError(
        "Je ne peux pas parler dans ce canal vocal, assurez-vous que j'ai les autorisations appropriées !",
        message.channel
      );

    var searchString = args.join(' ');
    if (!searchString)
      return sendError(
        'Donne moi plus de détail, un titre ou un artiste',
        message.channel
      );

    var serverQueue = message.client.queue.get(message.guild.id);
    try {
      var searched = await YouTube.search(searchString, { limit: 10 });
      if (searched[0] == undefined)
        return sendError(
          "Il semble que je n'ai pas pu trouver la chanson sur YouTube",
          message.channel
        );
      let index = 0;
      let embedPlay = new MessageEmbed()
        .setColor('BLUE')
        .setAuthor(
          `Résultat pour \"${args.join(' ')}\"`,
          message.author.displayAvatarURL()
        )
        .setDescription(
          `${searched
            .map(
              (video2) =>
                `**\`${++index}\`  |** [\`${video2.title}\`](${
                  video2.url
                }) - \`${video2.durationFormatted}\``
            )
            .join('\n')}`
        )
        .setFooter(
          "Tapez le numéro de la chanson pour l'ajouter à la playlist"
        );
      // eslint-disable-next-line max-depth
      message.channel.send(embedPlay).then((m) =>
        m.delete({
          timeout: 15000,
        })
      );
      try {
        var response = await message.channel.awaitMessages(
          (message2) => message2.content > 0 && message2.content < 11,
          {
            max: 1,
            time: 20000,
            errors: ['time'],
          }
        );
      } catch (err) {
        console.error(err);
        return message.channel.send({
          embed: {
            color: 'RED',
            description:
              "Rien n'a été sélectionné dans les 20 secondes, la demande a été annulée.",
          },
        });
      }
      const videoIndex = parseInt(response.first().content);
      var video = await searched[videoIndex - 1];
    } catch (err) {
      console.error(err);
      return message.channel.send({
        embed: {
          color: 'RED',
          description: "🆘  **|**  Je n'ai pas pu obtenir de résultats.",
        },
      });
    }

    response.delete();
    var songInfo = video;

    const song = {
      id: songInfo.id,
      title: Util.escapeMarkdown(songInfo.title),
      views: String(songInfo.views).padStart(10, ' '),
      ago: songInfo.uploadedAt,
      duration: songInfo.durationFormatted,
      url: `https://www.youtube.com/watch?v=${songInfo.id}`,
      img: songInfo.thumbnail.url,
      req: message.author,
    };

    if (serverQueue) {
      serverQueue.songs.push(song);
      let thing = new MessageEmbed()
        .setAuthor(
          'Chanson ajoutée à la liste',
          'https://raw.githubusercontent.com/SudhanPlayz/Discord-MusicBot/master/assets/Music.gif'
        )
        .setThumbnail(song.img)
        .setColor('YELLOW')
        .addField('Nom', song.title, true)
        .addField('Durée', song.duration, true)
        .addField('Demandé par', song.req.tag, true)
        .setFooter(`Vues: ${song.views} | Depuis: ${song.ago}`);
      return message.channel.send(thing);
    }

    const queueConstruct = {
      textChannel: message.channel,
      voiceChannel: channel,
      connection: null,
      songs: [],
      volume: 80,
      playing: true,
      loop: false,
    };
    message.client.queue.set(message.guild.id, queueConstruct);
    queueConstruct.songs.push(song);

    const play = async (song) => {
      const queue = message.client.queue.get(message.guild.id);
      if (!song) {
        sendError(
          "Aucune musiques n'a été trouvée dans la file d'attente de la playlist.\n Ajouter de la musique encore et encore 24h/24 7j/7\n\n Merci d'utiliser Poseidon !",
          message.channel
        );
        message.guild.me.voice.channel.leave(); //If you want your bot stay in vc 24/7 remove this line :D
        message.client.queue.delete(message.guild.id);
        return;
      }
      let stream = null;
      if (song.url.includes('youtube.com')) {
        stream = await ytdl(song.url);
        stream.on('error', function (er) {
          if (er) {
            if (queue) {
              queue.songs.shift();
              play(queue.songs[0]);
              return sendError(
                `Une erreur inattendue est survenue.\nType Possible \`${er}\``,
                message.channel
              );
            }
          }
        });
      }

      queue.connection.on('disconnect', () =>
        message.client.queue.delete(message.guild.id)
      );
      const dispatcher = queue.connection
        .play(
          ytdl(song.url, {
            quality: 'highestaudio',
            highWaterMark: 1 << 25,
            type: 'opus',
          })
        )
        .on('finish', () => {
          const shiffed = queue.songs.shift();
          if (queue.loop === true) {
            queue.songs.push(shiffed);
          }
          play(queue.songs[0]);
        });

      dispatcher.setVolumeLogarithmic(queue.volume / 100);
      let thing = new MessageEmbed()
        .setAuthor(
          'Lancement de la musique',
          'https://raw.githubusercontent.com/SudhanPlayz/Discord-MusicBot/master/assets/Music.gif'
        )
        .setThumbnail(song.img)
        .setColor('BLUE')
        .addField('Nom', song.title, true)
        .addField('Durée', song.duration, true)
        .addField('Demandé par', song.req.tag, true)
        .setFooter(`Vues: ${song.views} | Depuis: ${song.ago}`);
      queue.textChannel.send(thing);
    };

    try {
      const connection = await channel.join();
      queueConstruct.connection = connection;
      channel.guild.voice.setSelfDeaf(true);
      play(queueConstruct.songs[0]);
    } catch (error) {
      console.error(`Je n'ai pas pu rejoindre le canal vocal: ${error}`);
      message.client.queue.delete(message.guild.id);
      await channel.leave();
      return sendError(
        `Je n'ai pas pu rejoindre le canal vocal: ${error}`,
        message.channel
      );
    }
  },
};
