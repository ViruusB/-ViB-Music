module.exports = async (client) => {
  console.log(`[API] ${client.user.username} connecté !`);
  console.log(
    `[API] ${client.user.username} est en ligne sur ${client.guilds.cache.size} serveur !`
  );
  client.channels.cache
    .get('749855316543537163')
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
