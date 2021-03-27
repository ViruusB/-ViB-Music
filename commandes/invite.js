const { MessageEmbed } = require('discord.js');
const chalk = require('chalk');

module.exports = {
  info: {
    name: 'invite',
    description: 'Pour ajouter / inviter le bot sur votre serveur',
    usage: '',
    aliases: ['inv', 'inviter', 'ajouter', 'ajout'],
  },

  run: async function (client, message, args) {
    var permissions = 37080128;

    let invite = new MessageEmbed()
      .setTitle(`Invite ${client.user.username}`)
      .setDescription(
        `Voici mon lien pour m'inviter sur votre serveur ! \n\n [Lien d'invitation](https://discord.com/oauth2/authorize?client_id=${client.user.id}&permissions=${permissions}&scope=bot)`
      )
      .setURL(
        `https://discord.com/oauth2/authorize?client_id=${client.user.id}&permissions=${permissions}&scope=bot`
      )
      .setColor('RANDOM');
      setTimeout(() => message.delete(), 3000);
      console.log(`${(chalk.green(`${message.author.username}`))}` +' sur '+ (chalk.magenta(`${message.guild.name}`)) + ' salon ' + (chalk.magenta(`${message.channel.name}`))+' : ' + ' A ouvert la fonction [' + (chalk.cyan(` INVITE `))+ ']')
    return message.channel.send(invite);
  },
};

