
require("dotenv").config();
const chalk = require('chalk');
const fs = require('fs');
const { Collection, Client } = require('discord.js');

const client = new Client();
client.commands = new Collection();
client.queue = new Map();

client.config = {
  prefix: process.env.PREFIX
};

fs.readdir(__dirname + '/events/', (err, files) => {
  if (err) return console.error(err);
  files.forEach((file) => {
    const event = require(__dirname + `/events/${file}`);
    let eventName = file.split('.')[0];
    client.on(eventName, event.bind(null, client));
    console.log(chalk.green(`Chargement de: ${eventName}` + " -> En ligne !"));
  });
  console.log(
    chalk.magenta`Nombre d'événements chargées ! Total: ${files.length}/${files.length}`
  );
});

fs.readdir('./commandes/', (err, files) => {
  if (err) return console.error(err);
  files.forEach((file) => {
    if (!file.endsWith('.js')) return;
    let props = require(`./commandes/${file}`);
    let commandName = file.split('.')[0];
    client.commands.set(commandName, props);
    console.log(chalk.green(`Chargement de: ${commandName}` + " -> En ligne !"));
  });
  console.log(
    (chalk.magenta`Nombre de commandes "MUSIC" chargées ! Total: ${files.length}/${files.length}`
  ));
});

client.login(process.env.TOKEN);
