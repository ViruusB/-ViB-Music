const { MessageEmbed } = require('discord.js');
const sendError = require('../util/error');
const chalk = require('chalk');

module.exports = {
  info: {
    name: 'nowplaying',
    description: 'Pour afficher la musique en cours de lecture',
    usage: '',
    aliases: ['np', 'encour', 'ec'],
  },

  run: async function (client, message, args) {
    console.log(`${(chalk.green(`${message.author.username}`))}` +' sur '+ (chalk.magenta(`${message.guild.name}`)) + ' salon ' + (chalk.magenta(`${message.channel.name}`))+' : ' + ' A ouvert la fonction [' + (chalk.cyan(`${message.author.lastMessage}`))+ ']')
    const serverQueue = message.client.queue.get(message.guild.id);
    setTimeout(() => message.delete(), 3000);
    if (!serverQueue)
      return sendError(
        "Il n'y a aucune musique qui joue actuellement.",
        message.channel
      );
    let song = serverQueue.songs[0];
    let thing = new MessageEmbed()
      .setAuthor(
        'Lecture en cour',
        'https://raw.githubusercontent.com/ViruusB/-ViB-/main/assets/lecture.gif'
      )
      .setThumbnail(song.img)
      .setColor('2f3136')
      .addField('Nom', `[${song.title}](${song.url})`, '\n')
      .addField('Durée', ':stopwatch: ' + song.duration, true)
      .addField('Volume', ':loud_sound: ' + serverQueue.volume, true)
      .setFooter(`Vues: ${song.views} | Année: ${song.ago} | Ajouté: ${song.req.tag}`);
    return message.channel.send(thing);
  },
};
