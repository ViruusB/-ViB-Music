module.exports = {
  info: {
    name: 'ping',
    description: 'Affiche la Latence du Bot.',
    usage: '',
    aliases: ['pong'],
  },

  run: async function (client, message, args) {
    const msg = await message.channel.send('En cour de calcul...');
    msg.edit(
      `\`\`Latence du bot: ${
        msg.createdTimestamp - message.createdTimestamp
      } ms.\nLatence de l'API: ${Math.round(client.ws.ping)} ms\`\`.
          `
    );
  },
};
