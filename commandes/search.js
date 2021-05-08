const { Util, MessageEmbed } = require("discord.js");
const ytdl = require("ytdl-core");
const { play } = require("../util/playing");
const yts = require("yt-search");
const YouTube = require("youtube-sr");
const sendError = require("../util/error");
const scdl = require("soundcloud-downloader").default;
const chalk = require('chalk');

module.exports = {
    info: {
      name: 'search',
      description: 'Pour chercher une musique',
      usage: '<nom_de_la_chanson>, <artiste>',
      aliases: ['sc', 'chercher', 'recherche', 'ch'],
    },

    run: async function (client, message, args) {
      console.log(`${(chalk.green(`${message.author.username}`))}` +' sur '+ (chalk.magenta(`${message.guild.name}`)) + ' salon ' + (chalk.magenta(`${message.channel.name}`))+' : ' + ' A ouvert la fonction [' + (chalk.cyan(`${message.author.lastMessage}`))+ ']')
        let channel = message.member.voice.channel;
        setTimeout(() => message.delete(), 3000);
        if (!channel)
          return sendError(
            'Je suis désolé mais vous devez être dans un salon vocal pour écouter de la musique !',
            message.channel
          );
    
        const permissions = channel.permissionsFor(message.client.user);
        if (!permissions.has('CONNECT'))
          return sendError(
            'Je ne parviens pas à me connecter à votre salon vocal, assurez-vous que je dispose des autorisations appropriées !',
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

          var serverQueue = message.client.queue.get(message.guild.id);
          try {
            var searched = await YouTube.search(searchString, { limit: 10 });
            if (searched[0] == undefined)
              return sendError(
                "Il semble que je n'ai pas pu trouver la chanson demandée.",
                message.channel
              );
            let index = 0;
            let embedPlay = new MessageEmbed()
              .setColor('2f3136')
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
              .setFooter("Taper le numéro de la chanson pour l'ajouter à la file\nVous avez 30 secondes.");
      
            message.channel.send(embedPlay).then((m) =>
              m.delete({
                timeout: 30000,
              })
            );
            try {
                var response = await message.channel.awaitMessages((message2) => message2.content > 0 && message2.content < 11, {
                    max: 1,
                    time: 20000,
                    errors: ["time"],
                });
            } catch (err) {
                console.error(err);
                return message.channel.send({
                    embed: {
                        color: "2f3136",
                        description: "Rien n'a été sélectionné dans les 30 secondes, la demande a été annulée.",
                    },
                });
            }
            const videoIndex = parseInt(response.first().content);
            var video = await searched[videoIndex - 1];
        } catch (err) {
            console.error(err);
            return message.channel.send({
                embed: {
                    color: "2f3136",
                    description: "🆘  **|**  Je n'ai pas pu obtenir de résultats.",
                },
            });
        }

        response.delete();
        var songInfo = video;

        const song = {
            id: songInfo.id,
            title: Util.escapeMarkdown(songInfo.title),
            views: String(songInfo.views).padStart(10, " "),
            ago: songInfo.uploadedAt,
            duration: songInfo.durationFormatted,
            url: `https://www.youtube.com/watch?v=${songInfo.id}`,
            img: songInfo.thumbnail.url,
            req: message.author,
        };

        if (serverQueue) {
            serverQueue.songs.push(song);
            let searchplay = new MessageEmbed()
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
            return message.channel.send(searchplay);
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

        try {
            const connection = await channel.join();
            queueConstruct.connection = connection;
            play(queueConstruct.songs[0], message);
        } catch (error) {
            console.error(`Je n'ai pas pu rejoindre le salon vocal: ${error}`);
            message.client.queue.delete(message.guild.id);
            await channel.leave();
            return sendError(`Je n'ai pas pu rejoindre le salon vocal: ${error}`, message.channel);
        }
    },
};
