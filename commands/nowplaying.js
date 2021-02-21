const { MessageEmbed } = require('discord.js');
const sendError = require('../util/error');

module.exports = {
  info: {
    name: 'nowplaying',
    description: 'Pour afficher la musique en cours de lecture.',
    usage: '',
    aliases: ['np'],
  },

  run: async function (client, message, args) {
    const serverQueue = message.client.queue.get(message.guild.id);
    if (!serverQueue)
      return sendError(
        "Il n'y a rien qui joue sur ce serveur.",
        message.channel
      );
    let song = serverQueue.songs[0];
    let thing = new MessageEmbed()
      .setAuthor(
        'Joue Actuellement',
        'https://raw.githubusercontent.com/SudhanPlayz/Discord-MusicBot/master/assets/Music.gif'
      )
      .setThumbnail(song.img)
      .setColor('BLUE')
      .addField('Nom', song.title, true)
      .addField('Duraée', song.duration, true)
      .addField('Demandé par', song.req.tag, true)
      .setFooter(`Vues sur YouTube: ${song.views} | Depuis: ${song.ago}`);
    return message.channel.send(thing);
  },
};
