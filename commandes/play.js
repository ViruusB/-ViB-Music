const { play } = require("../util/playing");
const { Util, MessageEmbed } = require("discord.js");
const ytdl = require("ytdl-core");
const yts = require("yt-search");
const sendError = require("../util/error");
const scdl = require("soundcloud-downloader").default;
const chalk = require('chalk');

module.exports = {
    info: {
      name: 'play',
      description: 'Lecture de la chanson',
      usage: '<YouTube_URL> | <nom_de_la_chanson> | <artiste>',
      aliases: ['p', 'lecture'],
    },

    run: async function (client, message, args) {
        console.log(`${(chalk.green(`${message.author.username}`))}` +' sur '+ (chalk.magenta(`${message.guild.name}`)) + ' salon ' + (chalk.magenta(`${message.channel.name}`))+' : ' + ' A ouvert la fonction [' + (chalk.cyan(`${message.author.lastMessage}`))+ ']')
        let channel = message.member.voice.channel;
        if (!channel) return sendError("Je suis désolé mais vous devez être dans un salon vocal pour écouter de la musique !", message.channel);

        const permissions = channel.permissionsFor(message.client.user);
        if (!permissions.has("CONNECT")) return sendError("Je ne parviens pas à me connecter à votre salon vocal, assurez-vous que j'ai les autorisations appropriées !", message.channel);
        if (!permissions.has("SPEAK")) return sendError("Je ne peux pas parler dans ce salon vocal, assurez-vous que j'ai les autorisations appropriées !", message.channel);

        var searchString = args.join(" ");
        if (!searchString) return sendError("Il me faut plus de détails: Nom de la musique, Artiste ou YouTube URL", message.channel);
        const url = args[0] ? args[0].replace(/<(.+)>/g, "$1") : "";
        var serverQueue = message.client.queue.get(message.guild.id);

        let songInfo;
        let song;
        if (url.match(/^(https?:\/\/)?(www\.)?(m\.)?(youtube\.com|youtu\.?be)\/.+$/gi)) {
            try {
                songInfo = await ytdl.getInfo(url);
                if (!songInfo) return sendError("Il semble que je n'ai pas pu trouver la chanson sur YouTube", message.channel);
                song = {
                    id: songInfo.videoDetails.videoId,
                    title: songInfo.videoDetails.title,
                    url: songInfo.videoDetails.video_url,
                    img: songInfo.player_response.videoDetails.thumbnail.thumbnails[0].url,
                    duration: songInfo.videoDetails.lengthSeconds,
                    ago: songInfo.videoDetails.publishDate,
                    views: String(songInfo.videoDetails.viewCount).padStart(10, " "),
                    req: message.author,
                };
            } catch (error) {
                console.error(error);
                return message.reply(error.message).catch(console.error);
            }
        } else if (url.match(/^https?:\/\/(soundcloud\.com)\/(.*)$/gi)) {
            try {
                songInfo = await scdl.getInfo(url);
                if (!songInfo) return sendError("Il semble que je n'ai pas pu trouver la chanson sur SoundCloud", message.channel);
                song = {
                    id: songInfo.permalink,
                    title: songInfo.title,
                    url: songInfo.permalink_url,
                    img: songInfo.artwork_url,
                    ago: songInfo.last_modified,
                    views: String(songInfo.playback_count).padStart(10, " "),
                    duration: Math.ceil(songInfo.duration / 1000),
                    req: message.author,
                };
            } catch (error) {
                console.error(error);
                return sendError(error.message, message.channel).catch(console.error);
            }
        } else {
            try {
                var searched = await yts.search(searchString);
                if (searched.videos.length === 0) return sendError("Il semble que je n'ai pas pu trouver la chanson sur YouTube", message.channel);

                songInfo = searched.videos[0];
                song = {
                    id: songInfo.videoId,
                    title: Util.escapeMarkdown(songInfo.title),
                    views: String(songInfo.views).padStart(10, " "),
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
            let playmusic = new MessageEmbed()
            .setAuthor(
                'Musique ajoutée à la liste',
                'https://raw.githubusercontent.com/ViruusB/-ViB-/main/assets/lecture.gif'
              )
              .setThumbnail(song.img)
              .setColor('2f3136')
              .addField('Nom', `[${song.title}](${song.url})`, '\n')
              .addField('Durée', ':stopwatch: ' + song.duration, true)
              .addField('Volume', ':loud_sound: ' + serverQueue.volume, true)
              .setFooter(`Vues: ${song.views} | Année: ${song.ago} | Ajouté: ${song.req.tag}`);
            return message.channel.send(playmusic);
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
        queueConstruct.songs.push(song);
        message.client.queue.set(message.guild.id, queueConstruct);

        try {
            const connection = await channel.join();
            queueConstruct.connection = connection;
            play(queueConstruct.songs[0], message);
        } catch (error) {
            console.error(`Je n'ai pas pu rejoindre le canal vocal: ${error}`);
            message.client.queue.delete(message.guild.id);
            await channel.leave();
            return sendError(`Je n'ai pas pu rejoindre le canal vocal: ${error}`, message.channel);
        }
    },
};
