module.exports = async (client) => {
  console.log(`[API] ${client.user.username} connecté !`);
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
