const { MessageEmbed } = require('discord.js');
const sendError = require('../util/error');

module.exports = {
  info: {
    name: 'shuffle',
    description: 'Passer en lecture aléatoire',
    usage: '',
    aliases: ['shuffle', 'melanger', 'aleatoire'],
  },

  run: async function (client, message, args) {
    const serverQueue = message.client.queue.get(message.guild.id);
    if (!serverQueue)
      return sendError('Aucune chanson est en attente.', message.channel).catch(
        console.error
      );
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
        `:notes: L'utilisateur a arrété et la liste des chansons a été effacées: \`${error}\``,
        message.channel
      );
    }
  },
};
