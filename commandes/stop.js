const { MessageEmbed } = require('discord.js');
const sendError = require('../util/error');

module.exports = {
  info: {
    name: 'stop',
    description: "Pour arrêter la musique et effacer la file d'attente",
    usage: '',
    aliases: [],
  },

  run: async function (client, message, args) {
    const channel = message.member.voice.channel;
    if (!channel)
      return sendError(
        'Je suis désolé mais vous devez être dans un salon vocal pour écouter de la musique !',
        message.channel
      );
    const serverQueue = message.client.queue.get(message.guild.id);
    if (!serverQueue)
      return sendError(
        "Il n'y a aucune chanson en cour que je pourrais arrêter.",
        message.channel
      );
    if (!serverQueue.connection) return;
    if (!serverQueue.connection.dispatcher) return;
    try {
      serverQueue.connection.dispatcher.end();
    } catch (error) {
      message.guild.me.voice.channel.leave();
      message.client.queue.delete(message.guild.id);
      return sendError(
        `:notes: L'utilisateur a arrété et la liste des chansons a été effacées: ${error}`,
        message.channel
      );
    }
    message.client.queue.delete(message.guild.id);
    serverQueue.songs = [];
    message.react('✅');
  },
};
