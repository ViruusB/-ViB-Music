const { MessageEmbed } = require('discord.js');
const sendError = require('../util/error');

module.exports = {
  info: {
    name: 'loop',
    description: 'Mettre la musique en boucle',
    usage: 'loop',
    aliases: ['l'],
  },

  run: async function (client, message, args) {
    const serverQueue = message.client.queue.get(message.guild.id);
    if (serverQueue) {
      serverQueue.loop = !serverQueue.loop;
      return message.channel.send({
        embed: {
          color: 'GREEN',
          description: `🔁  **|**  La boucle est **\`${
            serverQueue.loop === true ? 'ACTIVE' : 'DESACTIVE'
          }\`**`,
        },
      });
    }
    return sendError("Il n'y a rien qui joue sur ce serveur.", message.channel);
  },
};
