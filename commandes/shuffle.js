const { MessageEmbed } = require('discord.js');
const sendError = require('../util/error');

module.exports = {
  info: {
    name: 'shuffle',
    description: "Mélanger la file d'attente.",
    usage: '[shuffle]',
    aliases: ['shuffle'],
  },

  run: async function (client, message, args) {
    const serverQueue = message.client.queue.get(message.guild.id);
    if (!serverQueue)
      return sendError(
        "Il n'y a pas de file d'attente.",
        message.channel
      ).catch(console.error);
    try {
      let songs = serverQueue.songs;
      for (let i = songs.length - 1; i > 1; i--) {
        let j = 1 + Math.floor(Math.random() * i);
        [songs[i], songs[j]] = [songs[j], songs[i]];
      }
      serverQueue.songs = songs;
      message.client.queue.set(message.guild.id, serverQueue);
      message.react('✅');
    } catch (error) {
      message.guild.me.voice.channel.leave();
      message.client.queue.delete(message.guild.id);
      return sendError(
        `:notes: L'utilisateur a arrêté et la file d'attente a été effacée.: \`${error}\``,
        message.channel
      );
    }
  },
};
