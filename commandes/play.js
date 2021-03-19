const { Util, MessageEmbed } = require('discord.js');
const ytdl = require('ytdl-core');
const ytdlDiscord = require('ytdl-core-discord');
const yts = require('yt-search');
const fs = require('fs');
const sendError = require('../util/error');

module.exports = {
  info: {
    name: 'play',
    description: 'Lecture de la chanson',
    usage: '<YouTube_URL> | <nom_de_la_chanson> | <artiste>',
    aliases: ['p', 'lecture'],
  },

  run: async function (client, message, args) {
    let channel = message.member.voice.channel;
    if (!channel)
      return sendError(
        'Je suis désolé mais vous devez être dans un salon vocal pour écouter de la musique !',
        message.channel
      );

    const permissions = channel.permissionsFor(message.client.user);
    if (!permissions.has('CONNECT'))
      return sendError(
        "Je ne parviens pas à me connecter à votre salon vocal, assurez-vous que j'ai les autorisations appropriées !",
        message.channel
      );
    if (!permissions.has('SPEAK'))
      return sendError(
        "Je ne peux pas parler dans ce salon vocal, assurez-vous que j'ai les autorisations appropriées !",
        message.channel
      );

    var searchString = args.join(' ');
    if (!searchString)
      return sendError(
        'Il me faut plus de détails: Nom de la musique, Artiste ou YouTube URL',
        message.channel
      );
    const url = args[0] ? args[0].replace(/<(.+)>/g, '$1') : '';
    var serverQueue = message.client.queue.get(message.guild.id);

    let songInfo = null;
    let song = null;
    if (
      url.match(/^(https?:\/\/)?(www\.)?(m\.)?(youtube\.com|youtu\.?be)\/.+$/gi)
    ) {
      try {
        songInfo = await ytdl.getInfo(url);
        if (!songInfo)
          return sendError(
            "Il semble que je n'ai pas pu trouver la chanson demandée.",
            message.channel
          );
        song = {
          id: songInfo.videoDetails.videoId,
          title: songInfo.videoDetails.title,
          url: songInfo.videoDetails.video_url,
          img:
            songInfo.player_response.videoDetails.thumbnail.thumbnails[0].url,
          duration: songInfo.videoDetails.lengthSeconds,
          ago: songInfo.videoDetails.publishDate,
          views: String(songInfo.videoDetails.viewCount).padStart(10, ' '),
          req: message.author,
        };
      } catch (error) {
        console.error(error);
        return message.reply(error.message).catch(console.error);
      }
    } else {
      try {
        var searched = await yts.search(searchString);
        if (searched.videos.length === 0)
          return sendError(
            "Il semble que je n'ai pas pu trouver la chanson demandée.",
            message.channel
          );

        songInfo = searched.videos[0];
        song = {
          id: songInfo.videoId,
          title: Util.escapeMarkdown(songInfo.title),
          views: String(songInfo.views).padStart(10, ' '),
          url: songInfo.url,
          ago: songInfo.ago,
          duration: songInfo.duration.toString(),
          img: songInfo.image,
          req: message.author,
        };
      } catch (error) {
        console.error(error);
        return message.reply(error.message).catch(console.error);
      }
    }

    if (serverQueue) {
      serverQueue.songs.push(song);
      let thing = new MessageEmbed()
        .setAuthor(
          'Musique ajoutée à la liste',
          'https://raw.githubusercontent.com/SudhanPlayz/Discord-MusicBot/master/assets/Music.gif'
        )
        .setThumbnail(song.img)
        .setColor('RANDOM')
        .addField('Nom', song.title, '\n')
        .addField('Durée', ':stopwatch: ' + song.duration, true)
        .addField('Volume', ':loud_sound: ' + queue.volume, true)
        .setFooter(`Vues: ${song.views} | Année: ${song.ago} | Par: ${song.req.tag}`);
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
          "Aucune musiques en attente n'a été trouvées.\n Veuillez ajouter de la musique.",
          message.channel
        );
        message.guild.me.voice.channel.leave();
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
                `Une erreur inattendue est survenue.\nType \`${er}\``,
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
        .setColor('RANDOM')
        .addField('Nom', song.title, '\n')
        .addField('Durée', ':stopwatch: ' + song.duration, true)
        .addField('Volume', ':loud_sound: ' + queue.volume, true)
        .setFooter(`Vues: ${song.views} | Année: ${song.ago} | Par: ${song.req.tag}`);
      queue.textChannel.send(thing);
    };

    try {
      const connection = await channel.join();
      queueConstruct.connection = connection;
      play(queueConstruct.songs[0]);
    } catch (error) {
      console.error(`Je n'ai pas pu rejoindre le salon vocal: ${error}`);
      message.client.queue.delete(message.guild.id);
      await channel.leave();
      return sendError(
        `Je n'ai pas pu rejoindre le salon vocal: ${error}`,
        message.channel
      );
    }
  },
};
