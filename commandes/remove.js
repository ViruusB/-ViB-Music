const { MessageEmbed } = require('discord.js');
const sendError = require('../util/error');

module.exports = {
  info: {
    name: 'remove',
    description: "Supprimer la chanson de la file d'attente",
    usage: '<numero>',
    aliases: ['rm', 'enlever', 'enleve', 'supprimer', 'supp', 'sup'],
  },

  run: async function (client, message, args) {
    const queue = message.client.queue.get(message.guild.id);
    if (!queue)
      return sendError('Aucune chanson est en attente.', message.channel).catch(
        console.error
      );
    if (!args.length)
      return sendError(`Utilisation: \`!remove <numero_dans_la_file>\``);
    if (isNaN(args[0]))
      return sendError(`Utilisation: \`!remove <numero_dans_la_file>\``);
    if (queue.songs.length == 1)
      return sendError('Aucune chanson est en attente.', message.channel).catch(
        console.error
      );
    if (args[0] > queue.songs.length)
      return sendError(
        `La liste est seulement de ${queue.songs.length} chansons !`,
        message.channel
      ).catch(console.error);
    try {
      const song = queue.songs.splice(args[0] - 1, 1);
      sendError(
        `❌ **|** **\`${song[0].title}\`** supprimé de la liste.`,
        queue.textChannel
      ).catch(console.error);
      message.react('✅');
    } catch (error) {
      return sendError(
        `:notes: Une erreur inattendue est apparue.\nType ${error}`,
        message.channel
      );
    }
  },
};
