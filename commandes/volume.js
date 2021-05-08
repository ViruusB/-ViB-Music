const { MessageEmbed } = require('discord.js');
const sendError = require('../util/error');
const chalk = require('chalk');

module.exports = {
  info: {
    name: 'volume',
    description: 'Pour modifier le volume de la musique',
    usage: '[nombre]',
    aliases: ['v', 'vol'],
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
        "Il n'y a aucune musique qui joue actuellement.",
        message.channel
      );
    if (!serverQueue.connection)
      return sendError(
        "Il n'y a aucune musique qui joue actuellement.",
        message.channel
      );
    if (!args[0])
    if (!args[0])
      return message.channel.send(
        `\`\`Le volume actuel est de:\`\` **${serverQueue.volume} :loud_sound: **`
      );
    if (isNaN(args[0]))
      return message.channel
        .send(':notes: | Nombres uniquement !')
        .catch((err) => console.log(err));
    if (parseInt(args[0]) > 150 && args[0] < 0)
      return sendError(
        'Vous ne pouvez pas régler le volume à plus de 150 ou inférieur à 0',
        message.channel
      ).catch((err) => console.log(err));
    serverQueue.volume = args[0];
    serverQueue.connection.dispatcher.setVolumeLogarithmic(args[0] / 100);
    let xd = new MessageEmbed()
      .setDescription(`Volume réglé sur: \`\`${args[0] / 1}\`\` :loud_sound:`)
      .setAuthor(
        'Volume',
        'https://raw.githubusercontent.com/ViruusB/-ViB-/main/assets/volume.gif'
      )
      .setColor('YELLOW');
    return message.channel.send(xd);
  },
};
