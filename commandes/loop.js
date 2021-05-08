const { MessageEmbed } = require('discord.js');
const sendError = require('../util/error');
const chalk = require('chalk');

module.exports = {
  info: {
    name: 'loop',
    description: 'Mettre la musique en boucle',
    usage: '',
    aliases: ['l', 'repeat', 'repete', 'repeter'],
  },

  run: async function (client, message, args) {
    console.log(`${(chalk.green(`${message.author.username}`))}` +' sur '+ (chalk.magenta(`${message.guild.name}`)) + ' salon ' + (chalk.magenta(`${message.channel.name}`))+' : ' + ' A ouvert la fonction [' + (chalk.cyan(`${message.author.lastMessage}`))+ ']')
    const serverQueue = message.client.queue.get(message.guild.id);
    if (serverQueue) {
      serverQueue.loop = !serverQueue.loop;
      setTimeout(() => message.delete(), 3000);
      return message.channel.send({
        embed: {
          color: 'GREEN',
          description: `🔁  **|**  Musique actuelle en boucle:  **\`${
            serverQueue.loop === true ? 'ACTIVE' : 'DESACTIVE'
          }\`**`,
        },
      });
    }
    return sendError(
      "Il n'y a aucune musique qui joue actuellement.",
      message.channel
    );
  },
};
