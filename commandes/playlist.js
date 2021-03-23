const { Util, MessageEmbed } = require('discord.js');
const ytdl = require('ytdl-core');
const yts = require('yt-search');
const ytdlDiscord = require('ytdl-core-discord');
var ytpl = require('ytpl');
const sendError = require('../util/error');
const fs = require('fs');

module.exports = {
  info: {
    name: 'playlist',
    description: "Lecture d'une playlist",
    usage: '<YouTube_Playlist_URL | Nom_Playlist>',
    aliases: ['pl'],
  },

  run: async function (client, message, args) {
    const channel = message.member.voice.channel;
    setTimeout(() => message.delete(), 3000);
    if (!channel)
      return sendError(
        'Je suis désolé mais vous devez être dans un salon vocal pour écouter de la musique !',
        message.channel
      );
    const url = args[0] ? args[0].replace(/<(.+)>/g, '$1') : '';
    var searchString = args.join(' ');
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

    if (!searchString || !url)
      return sendError(
        `Utilisation: \`\`${message.client.config.prefix}playlist <YouTube_Playlist_URL | Nom_Playlist>\`\``,
        message.channel
      );
    if (url.match(/^https?:\/\/(www.youtube.com|youtube.com)\/playlist(.*)$/)) {
      try {
        const playlist = await ytpl(url.split('list=')[1]);
        if (!playlist)
          return sendError('Playlist non trouvée.', message.channel);
        const videos = await playlist.items;
        for (const video of videos) {
          await handleVideo(video, message, channel, true);
        }
        return message.channel.send({
          embed: {
            color: 'GREEN',
            description: `✅  **|**  Playlist: **\`${videos[0].title}\`** a été ajoutée a la liste de lecture.`,
          },
        });
      } catch (error) {
        console.error(error);
        return sendError('Playlist non trouvée.', message.channel).catch(
          console.error
        );
      }
    } else {
      try {
        var searched = await yts.search(searchString);

        if (searched.playlists.length === 0)
          return sendError(
            "Il semble que je n'ai pas pu trouver la playlist sur YouTube",
            message.channel
          );
        var songInfo = searched.playlists[0];
        let listurl = songInfo.listId;
        const playlist = await ytpl(listurl);
        const videos = await playlist.items;
        for (const video of videos) {
          await handleVideo(video, message, channel, true);
        }
        let thing = new MessageEmbed()
          .setAuthor(
            'Playlist ajoutée a la liste.',
            'https://raw.githubusercontent.com/SudhanPlayz/Discord-MusicBot/master/assets/Music.gif'
          )
          .setThumbnail(songInfo.thumbnail)
          .setColor('GREEN')
          .setDescription(
            `✅  **|**  Playlist: **\`${songInfo.title}\`** \`${songInfo.videoCount}\` a été ajouté a la liste.`
          );
        return message.channel.send(thing);
      } catch (error) {
        return sendError(
          'Une erreur inattendue est survenue',
          message.channel
        ).catch(console.error);
      }
    }

    async function handleVideo(video, message, channel, playlist = false) {
      const serverQueue = message.client.queue.get(message.guild.id);
      const song = {
        id: video.id,
        title: Util.escapeMarkdown(video.title),
        views: video.views ? video.views : '-',
        ago: video.ago ? video.ago : '-',
        duration: video.duration,
        url: `https://www.youtube.com/watch?v=${video.id}`,
        img: video.thumbnail,
        req: message.author,
      };
      if (!serverQueue) {
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

        try {
          var connection = await channel.join();
          queueConstruct.connection = connection;
          play(message.guild, queueConstruct.songs[0]);
        } catch (error) {
          console.error(`Je n'ai pas pu rejoindre le salon vocal: ${error}`);
          message.client.queue.delete(message.guild.id);
          return sendError(
            `Je n'ai pas pu rejoindre le salon vocal: ${error}`,
            message.channel
          );
        }
      } else {
        serverQueue.songs.push(song);
        if (playlist) return;
        let thing = new MessageEmbed()
          .setAuthor(
            'La chanson a été ajoutée à la liste',
            'https://raw.githubusercontent.com/SudhanPlayz/Discord-MusicBot/master/assets/Music.gif'
          )
          .setThumbnail(song.img)
          .setColor('YELLOW')
          .addField('Nom', song.title, '\n')
          .addField('Durée', ':stopwatch: ' + song.duration, true)
          .addField('Volume', ':loud_sound: ' + queue.volume, true)
          .setFooter(`Vues: ${song.views} | Année: ${song.ago} | Ajouté: ${song.req.tag}`);
        return message.channel.send(thing);
      }
      return;
    }

    async function play(guild, song) {
      const serverQueue = message.client.queue.get(message.guild.id);
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
            if (serverQueue) {
              serverQueue.songs.shift();
              play(guild, serverQueue.songs[0]);
              return sendError(
                `Une erreur inattendue est survenue.\nType \`${er}\``,
                message.channel
              );
            }
          }
        });
      }

      serverQueue.connection.on('disconnect', () =>
        message.client.queue.delete(message.guild.id)
      );
      const dispatcher = serverQueue.connection
        .play(
          ytdl(song.url, {
            quality: 'highestaudio',
            highWaterMark: 1 << 25,
            type: 'opus',
          })
        )
        .on('finish', () => {
          const shiffed = serverQueue.songs.shift();
          if (serverQueue.loop === true) {
            serverQueue.songs.push(shiffed);
          }
          play(guild, serverQueue.songs[0]);
        });

      dispatcher.setVolume(serverQueue.volume / 100);
      let thing = new MessageEmbed()
        .setAuthor(
          'Lancement de la musique',
          'https://raw.githubusercontent.com/SudhanPlayz/Discord-MusicBot/master/assets/Music.gif'
        )
        .setThumbnail(song.img)
        .setColor('RANDOM')
        .addField('Nom', song.title, '\n')
        .addField('Durée', ':stopwatch: ' + song.duration, true)
        .addField('Volume', ':loud_sound: ' + serverQueue.volume, true)
        .setFooter(`Vues: ${song.views} | Année: ${song.ago} | Ajouté: ${song.req.tag}`);
      serverQueue.textChannel.send(thing);
    }
  },
};
