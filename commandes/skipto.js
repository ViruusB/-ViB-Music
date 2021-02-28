const { MessageEmbed } = require('discord.js');
const sendError = require('../util/error');

module.exports = {
  info: {
    name: 'skipto',
    description: "Passer au numéro de file d'attente sélectionné.",
    usage: 'skipto <numero>',
    aliases: ['st'],
  },

  run: async function (client, message, args) {
    if (!args.length || isNaN(args[0]))
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
      return sendError(
        "Il n'y a pas de file d'attente.",
        message.channel
      ).catch(console.error);
    if (args[0] > queue.songs.length)
      return sendError(
        `La file d'attente est seulement de ${queue.songs.length} chansons !`,
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
        `:notes: L'utilisateur a arrêté et la file d'attente a été effacée.: ${error}`,
        message.channel
      );
    }

    queue.textChannel
      .send({
        embed: {
          color: 'GREEN',
          description: `${message.author} a passé \`${args[0] - 1}\` songs ⏭.`,
        },
      })
      .catch(console.error);
    message.react('✅');
  },
};