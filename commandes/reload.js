module.exports = {
  info: {
    name: 'reload',
    description: 'Redémarre le bot',
    usage: '',
    aliases: ['reload'],
  },

  run: async function (client, message, args) {
    await message.delete();
    await client.channels.cache
      .get('715930615173611567')
      .send('⚙️ | Poseidon redémarre !');
    process.exit();
  },
};
