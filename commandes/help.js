const { MessageEmbed } = require('discord.js');
const chalk = require('chalk');

module.exports = {
  info: {
    name: 'help',
    description: 'Pour afficher toutes les commandes',
    usage: 'ou [!help nom_de_la_commande]',
    aliases: ['commandes', 'aide', 'commande'],
  },

  run: async function (client, message, args) {
    console.log(`${(chalk.green(`${message.author.username}`))}` +' sur '+ (chalk.magenta(`${message.guild.name}`)) + ' salon ' + (chalk.magenta(`${message.channel.name}`))+' : ' + ' A ouvert la fonction [' + (chalk.cyan(`${message.author.lastMessage}`))+ ']')
    var allcmds = '';

    client.commands.forEach((cmd) => {
      let cmdinfo = cmd.info;
      allcmds +=
        '`' +
        client.config.prefix +
        cmdinfo.name +
        ' ' +
        cmdinfo.usage +
        '` ~ ' +
        cmdinfo.description +
        '\n';
    });

    let embed = new MessageEmbed()
      .setAuthor(
        'Liste des commandes de ' + client.user.username,
        'https://raw.githubusercontent.com/ViruusB/-ViB-/main/assets/lecture.gif'
      )
      .setColor('2f3136')
      .setDescription(allcmds)
      .setFooter(
        `Pour obtenir des informations sur chaque commandes, vous pouvez utiliser ${client.config.prefix}help [nom_de_la_commande]\nExemple: ${client.config.prefix}help play`
      );
      setTimeout(() => message.delete(), 3000);
    if (!args[0]) return message.channel.send(embed);
    else {
      let cmd = args[0];
      let command = client.commands.get(cmd);
      if (!command)
        command = client.commands.find((x) => x.info.aliases.includes(cmd));
      if (!command) return message.channel.send('Commande inconnue');
      let commandinfo = new MessageEmbed()
        .setTitle('Information de la Commande: ' + command.info.name + '')
        .setColor('2f3136').setDescription(`
Nom: \`\`${command.info.name}\`\`
Description: \`\`${command.info.description}\`\`
Utilisation: \`\`${client.config.prefix}${command.info.name} ${
        command.info.usage
      }\`\`
Alias: \`\`${command.info.aliases.join(', ')}\`\`
`);
      message.channel.send(commandinfo);
    }
  },
};
