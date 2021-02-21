const { MessageEmbed } = require('discord.js');
const sendError = require('../util/error');

module.exports = {
  info: {
    name: 'resume',
    description: 'Pour reprendre la musique en pause.',
    usage: '',
    aliases: [],
  },

  run: async function (client, message, args) {
    const serverQueue = message.client.queue.get(message.guild.id);
    if (serverQueue && !serverQueue.playing) {
      serverQueue.playing = true;
      serverQueue.connection.dispatcher.resume();
      let xd = new MessageEmbed()
        .setDescription('▶ La musique a été relancé.')
        .setColor('YELLOW')
        .setAuthor(
          'La musique à Repris !',
          'https://raw.githubusercontent.com/SudhanPlayz/Discord-MusicBot/master/assets/Music.gif'
        );
      return message.channel.send(xd);
    }
    return sendError("Il n'y a rien qui joue sur ce serveur.", message.channel);
  },
};
