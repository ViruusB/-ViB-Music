const { MessageEmbed } = require('discord.js');
const sendError = require('../util/error');
const chalk = require('chalk');

module.exports = {
  info: {
    name: 'stop',
    description: "Pour arrêter la musique et effacer la file d'attente",
    usage: '',
    aliases: ['arret', 'sp'],
  },

  run: async function (client, message, args) {
    console.log(`${(chalk.green(`${message.author.username}`))}` +' sur '+ (chalk.magenta(`${message.guild.name}`)) + ' salon ' + (chalk.magenta(`${message.channel.name}`))+' : ' + ' A ouvert la fonction [' + (chalk.cyan(`${message.author.lastMessage}`))+ ']')
    if (!message.member.hasPermission("MANAGE_MESSAGES"))
    return message.reply( ` tu n'as pas la permission d'utiliser la commande \`\`stop\`\``);
    const channel = message.member.voice.channel;
    setTimeout(() => message.delete(), 3000);
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
        `:notes: | L'utilisateur a arrété et la liste des chansons a été effacées: ${error}`,
        message.channel
      );
    }
    message.client.queue.delete(message.guild.id);
    serverQueue.songs = [];
    message.react('✅');
  },
};
