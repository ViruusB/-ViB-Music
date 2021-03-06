module.exports = async (client) => {
  console.log(`[API] ${client.user.username} connecté !`);
  console.log(
    `[API] ${client.user.username} est en ligne sur ${client.guilds.cache.size} serveur !`
  );
  client.channels.cache;
  let activities = [
      '!help',
      `${client.guilds.cache
        .map((g) => g.memberCount)
        .reduce((a, b) => a + b)} utilisateurs`,
      '[ViB]Music',
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
