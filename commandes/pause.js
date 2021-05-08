const { MessageEmbed } = require('discord.js');
const sendError = require('../util/error');
const chalk = require('chalk');

module.exports = {
  info: {
    name: 'pause',
    description: 'Pour mettre la musique actuelle en pause',
    usage: '',
    aliases: ['pause', 'pau'],
  },

  run: async function (client, message, args) {
    console.log(`${(chalk.green(`${message.author.username}`))}` +' sur '+ (chalk.magenta(`${message.guild.name}`)) + ' salon ' + (chalk.magenta(`${message.channel.name}`))+' : ' + ' A ouvert la fonction [' + (chalk.cyan(`${message.author.lastMessage}`))+ ']')
    const serverQueue = message.client.queue.get(message.guild.id);
    setTimeout(() => message.delete(), 3000);
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
        .setColor('2f3136')
        .setAuthor(
          'Pause',
          'https://raw.githubusercontent.com/ViruusB/-ViB-/main/assets/pause.png'
        );
      return message.channel.send(xd);
    }
    return sendError(
      "Il n'y a aucune musique qui joue actuellement.",
      message.channel
    );
  },
};
