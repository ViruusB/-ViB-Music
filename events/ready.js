module.exports = async (client) => {
  console.log(`[API] ${client.user.username} connecté !`);
  await client.user.setActivity('Music', {
    type: 'LISTENING',
  });
};
