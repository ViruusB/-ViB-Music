module.exports = {
  info: {
    name: 'reload',
    description: 'Redémarre le Bot [ADMIN]',
    usage: '',
    aliases: ['reload'],
  },

  run: async function (client, message, args) {
    if (
      !message.member.hasPermission('BAN_MEMBERS') &&
      message.author.id !== '297388490595762186'
    )
      return message.channel.send(
        `${message.author}, tu n'as pas la permission de faire ça !`
      );
    await message.delete();
    await client.channels.cache
      .get('749855316543537163')
      .send('⚙️ | Poseidon redémarre !');
    process.exit();
  },
};
