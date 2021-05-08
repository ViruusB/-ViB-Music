const { Util, MessageEmbed } = require('discord.js');
const sendError = require('../util/error');
const chalk = require('chalk');

module.exports = {
  info: {
    name: 'skip',
    description: 'Pour passer la musique actuelle',
    usage: '',
    aliases: ['s', 'passer', 'sk'],
  },

  run: async function (client, message, args) {
    console.log(`${(chalk.green(`${message.author.username}`))}` +' sur '+ (chalk.magenta(`${message.guild.name}`)) + ' salon ' + (chalk.magenta(`${message.channel.name}`))+' : ' + ' A ouvert la fonction [' + (chalk.cyan(`${message.author.lastMessage}`))+ ']')
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
        "Je ne peux pas passer cette musique. Aucune musiques en attente n'a été trouvées.",
        message.channel
      );
    if (!serverQueue.connection) return;
    if (!serverQueue.connection.dispatcher) return;
    if (serverQueue && !serverQueue.playing) {
      serverQueue.playing = true;
      serverQueue.connection.dispatcher.resume();
      let xd = new MessageEmbed()
        .setDescription('▶ | Reprend la musique pour vous')
        .setColor('2f3136')
        .setAuthor(
          'Skip',
          'https://raw.githubusercontent.com/ViruusB/-ViB-/main/assets/lecture.gif'
        );

      return message.channel.send(xd).catch((err) => console.log(err));
    }

    try {
      serverQueue.connection.dispatcher.end();
    } catch (error) {
      serverQueue.voiceChannel.leave();
      message.client.queue.delete(message.guild.id);
      return sendError(
        `:notes: L'utilisateur a arrété et la liste des chansons a été effacées: ${error}`,
        message.channel
      );
    }
    message.react('✅');
  },
};
