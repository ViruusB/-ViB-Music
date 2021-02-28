require('dotenv').config();
const fs = require('fs');
const { Collection, Client } = require('discord.js');

const client = new Client();
client.commands = new Collection();
client.queue = new Map();

client.config = {
  prefix: process.env.PREFIX,
};

fs.readdir(__dirname + '/events/', (err, files) => {
  if (err) return console.error(err);
  files.forEach((file) => {
    const event = require(__dirname + `/events/${file}`);
    let eventName = file.split('.')[0];
    client.on(eventName, event.bind(null, client));
    console.log('Chargement de Event: ' + eventName);
  });
});

fs.readdir('./commands/Bot/', (err, files) => {
  if (err) return console.error(err);
  files.forEach((file) => {
    if (!file.endsWith('.js')) return;
    let props = require(`./commands/Bot/${file}`);
    let commandName = file.split('.')[0];
    console.log(`Chargement de la commande: ${commandName}`);
    client.commands.set(commandName, props);
  });
  console.log(
    `Liste des commandes "Bot" chargés ! Total: ${files.length}/${files.length}`
  );
});

fs.readdir('./commands/Music/', (err, files) => {
  if (err) return console.error(err);
  files.forEach((file) => {
    if (!file.endsWith('.js')) return;
    let props = require(`./commands/Music/${file}`);
    let commandName = file.split('.')[0];
    console.log(`Chargement de la commande: ${commandName}`);
    client.commands.set(commandName, props);
  });
  console.log(
    `Liste des commandes "Music" chargés ! Total: ${files.length}/${files.length}`
  );
});

client.login(process.env.TOKEN);
