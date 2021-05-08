const { MessageEmbed } = require('discord.js');
const sendError = require('../util/error');
const chalk = require('chalk');

module.exports = {
  info: {
    name: 'skipto',
    description: 'Passer au numéro de la liste sélectionné.',
    usage: '<numero>',
    aliases: ['st', 'numero', 'skipnum', 'passernumero', 'passernum'],
  },

  run: async function (client, message, args) {
    console.log(`${(chalk.green(`${message.author.username}`))}` +' sur '+ (chalk.magenta(`${message.guild.name}`)) + ' salon ' + (chalk.magenta(`${message.channel.name}`))+' : ' + ' A ouvert la fonction [' + (chalk.cyan(`${message.author.lastMessage}`))+ ']')
    setTimeout(() => message.delete(), 3000);
    if (!args.length && isNaN(args[0]))
      return message.channel
        .send({
          embed: {
            color: 'GREEN',
            description: `**Utilisation**: \`${client.config.prefix}skipto <numero_dans_la_liste>\``,
          },
        })
        .catch(console.error);

    const queue = message.client.queue.get(message.guild.id);
    if (!queue)
      return sendError('Aucune chanson est en attente.', message.channel).catch(
        console.error
      );
    if (args[0] > queue.songs.length)
      return sendError(
        `La liste est seulement de ${queue.songs.length} chansons !`,
        message.channel
      ).catch(console.error);

    queue.playing = true;

    if (queue.loop) {
      for (let i = 0; i < args[0] - 2; i++) {
        queue.songs.push(queue.songs.shift());
      }
    } else {
      queue.songs = queue.songs.slice(args[0] - 2);
    }
    try {
      queue.connection.dispatcher.end();
    } catch (error) {
      queue.voiceChannel.leave();
      message.client.queue.delete(message.guild.id);
      return sendError(
        `:notes: L'utilisateur a arrété et la liste des chansons a été effacées: ${error}`,
        message.channel
      );
    }

    queue.textChannel
      .send({
        embed: {
          color: 'GREEN',
          description: `⏭ **|** ${message.author} a passé \`${
            args[0] - 1
          }\` chansons de la liste.`,
        },
      })
      .catch(console.error);
    message.react('✅');
  },
};
