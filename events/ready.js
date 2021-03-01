module.exports = async (client) => {
  console.log(`[API] ${client.user.username} connecté !`);
  client.channels.cache
    .get('715930615173611567')
    .send('⚙️ | Poseidon est en ligne !');
  let activities = [
      '!help',
      `${client.guilds.cache
        .map((g) => g.memberCount)
        .reduce((a, b) => a + b)} utilisateurs`,
      'PoseidonMusic',
    ],
    i = 0;

  setInterval(
    () =>
      client.user.setPresence({
        activity: {
          name: `${activities[i++ % activities.length]}`,
          type: 'LISTENING',
        },
        status: 'online',
      }),
    3000
  );
};
