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
      .get('749855316543537163')
      .send('⚙️ | Poseidon redémarre !');
    process.exit();
  },
};
