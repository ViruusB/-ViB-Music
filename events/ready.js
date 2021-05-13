const chalk = require('chalk');
const version = "2.8.9"

module.exports = async (client) => {
  console.log("--------------------------------------");
  console.log('--> ' + (chalk.yellow('ViruusB ©️')) + ' \n--> ' + (chalk.green('En ligne avec succès  ')) + ' \n--> ' + (chalk.magenta('Nom:              ')) + `[ ${client.user.tag} ]` + ' \n--> ' + (chalk.magenta('Commandes:        ')) + `[ ${client.commands.size} ]` + ' \n--> ' + (chalk.magenta('Préfix:           ')) + `[ ${client.config.prefix} ]` + '\n--> ' + (chalk.magenta('Utilisateurs:     ')) + `[ ${client.users.cache.size} ]` + '\n--> ' + (chalk.magenta('Salons:           ')) + `[ ${client.channels.cache.size} ]` + '\n--> ' + (chalk.magenta('Serveurs:         ')) + `[ ${client.guilds.cache.size} ]`);
  console.log("--------------------------------------");
  console.log('--> ' + (chalk.green`[API] ${client.user.username} connecté !`));
  console.log('______________________________________');
  client.channels.cache;
  let activities = [
      `${client.config.prefix}help`,
      `${client.guilds.cache
        .map((g) => g.memberCount)
        .reduce((a, b) => a + b)} utilisateurs`,
      `${version}`,
      '© ViruusB',
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
