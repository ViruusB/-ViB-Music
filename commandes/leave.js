const { MessageEmbed } = require('discord.js');
const sendError = require('../util/error');
const chalk = require('chalk');

module.exports = {
  info: {
    name: 'leave',
    description: 'Quitter le Bot du salon vocal',
    usage: '',
    aliases: ['quitter', 'l', 'deco', 'quitte'],
  },

  run: async function (client, message, args) {
    console.log(`${(chalk.green(`${message.author.username}`))}` +' sur '+ (chalk.magenta(`${message.guild.name}`)) + ' salon ' + (chalk.magenta(`${message.channel.name}`))+' : ' + ' A ouvert la fonction [' + (chalk.cyan(`${message.author.lastMessage}`))+ ']')
    if (!message.member.hasPermission("MANAGE_MESSAGES"))
    return message.reply( ` tu n'as pas la permission d'utiliser la commande \`\`leave\`\``);
    setTimeout(() => message.delete(), 3000);
    let channel = message.member.voice.channel;
    if (!channel)
      return sendError(
        'Je suis désolé mais vous devez être dans un salon vocal !',
        message.channel
      );
    if (!message.guild.me.voice.channel)
      return sendError('Je ne suis dans aucun salon vocal !', message.channel);

    try {
      await message.guild.me.voice.channel.leave();
    } catch (error) {
      await message.guild.me.voice.kick(message.guild.me.id);
      return sendError(
        'Essayer de quitter le salon vocal ...',
        message.channel
      );
    }

    const Embed = new MessageEmbed()
      .setAuthor(
        'Leave',
        'https://raw.githubusercontent.com/ViruusB/-ViB-/main/assets/lecture.gif'
      )
      .setColor('2f3136')
      .setDescription(`🎶 | ${client.user.username} a quitté le salon vocal.`)
      .setTimestamp();
    return message.channel.send(Embed)
      .catch(() => message.channel.send('🎶 Salon vocal quitté.'));
  },
};
