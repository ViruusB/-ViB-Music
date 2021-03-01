const { MessageEmbed } = require('discord.js');

module.exports = {
  info: {
    name: 'help',
    description: 'Pour afficher toutes les commandes',
    usage: 'ou [!help nom_de_la_commande]',
    aliases: ['commandes', 'aide'],
  },

  run: async function (client, message, args) {
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
        'https://raw.githubusercontent.com/SudhanPlayz/Discord-MusicBot/master/assets/Music.gif'
      )
      .setColor('BLUE')
      .setDescription(allcmds)
      .setFooter(
        `Pour obtenir des informations sur chaque commandes, vous pouvez faire ${client.config.prefix}help [nom_de_la_commande]`
      );

    if (!args[0]) return message.channel.send(embed);
    else {
      let cmd = args[0];
      let command = client.commands.get(cmd);
      if (!command)
        command = client.commands.find((x) => x.info.aliases.includes(cmd));
      if (!command) return message.channel.send('Commande inconnue');
      let commandinfo = new MessageEmbed()
        .setTitle('Information de la Commande: ' + command.info.name + '')
        .setColor('YELLOW').setDescription(`
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
