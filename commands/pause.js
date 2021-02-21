const { MessageEmbed } = require('discord.js');
const sendError = require('../util/error');

module.exports = {
  info: {
    name: 'pause',
    description: 'Pour mettre en pause la musique actuelle.',
    usage: '[pause]',
    aliases: ['pause'],
  },

  run: async function (client, message, args) {
    const serverQueue = message.client.queue.get(message.guild.id);
    if (serverQueue && serverQueue.playing) {
      serverQueue.playing = false;
      try {
        serverQueue.connection.dispatcher.pause();
      } catch (error) {
        message.client.queue.delete(message.guild.id);
        return sendError(
          `:notes: L'utilisateur a arrété et la file d'attente a été effacée.: ${error}`,
          message.channel
        );
      }
      let xd = new MessageEmbed()
        .setDescription('⏸ Mettez la musique en pause pour vous !')
        .setColor('YELLOW')
        .setTitle('La musique est en Pause !');
      return message.channel.send(xd);
    }
    return sendError("Il n'y a rien qui joue sur ce serveur.", message.channel);
  },
};
