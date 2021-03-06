const { MessageEmbed } = require('discord.js');
const sendError = require('../util/error');

module.exports = {
  info: {
    name: 'pause',
    description: 'Pour mettre la musique actuelle en pause',
    usage: '',
    aliases: ['pause', 'pau'],
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
          `:notes: L'utilisateur a arrété et la liste des chansons a été effacées: ${error}`,
          message.channel
        );
      }
      let xd = new MessageEmbed()
        .setDescription('⏸ | La musique a été mis en pause !')
        .setColor('YELLOW')
        .setAuthor(
          'Pause',
          'https://raw.githubusercontent.com/SudhanPlayz/Discord-MusicBot/master/assets/Music.gif'
        );
      return message.channel.send(xd);
    }
    return sendError(
      "Il n'y a aucune musique qui joue actuellement.",
      message.channel
    );
  },
};
