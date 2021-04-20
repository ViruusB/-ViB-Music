const chalk = require('chalk');

module.exports = async (client) => {
  console.log("--------------------------------------");
  console.log('--> ' + (chalk.yellow('ViruusB ©️')) + ' \n--> ' + (chalk.green('En ligne avec succès  ')) + ' \n--> ' + (chalk.magenta('Nom:              ')) + `[ ${client.user.tag} ]` + ' \n--> ' + (chalk.magenta('Commandes:        ')) + `[ ${client.commands.size} ]` + ' \n--> ' + (chalk.magenta('Préfix:           ')) + `[ ${client.config.prefix} ]` + '\n--> ' + (chalk.magenta('Utilisateurs:     ')) + `[ ${client.users.cache.size} ]` + '\n--> ' + (chalk.magenta('Salons:           ')) + `[ ${client.channels.cache.size} ]` + '\n--> ' + (chalk.magenta('Serveurs:         ')) + `[ ${client.guilds.cache.size} ]`);
  console.log("--------------------------------------");
  console.log('--> ' + (chalk.green`[API] ${client.user.username} connecté !`));
  console.log('______________________________________');
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
