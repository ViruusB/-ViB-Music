const { MessageEmbed } = require('discord.js');
const sendError = require('../util/error');

module.exports = {
  info: {
    name: 'loop',
    description: 'Mettre la musique en boucle',
    usage: '',
    aliases: ['l', 'repeat', 'repete', 'repeter'],
  },

  run: async function (client, message, args) {
    const serverQueue = message.client.queue.get(message.guild.id);
    if (serverQueue) {
      serverQueue.loop = !serverQueue.loop;
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
