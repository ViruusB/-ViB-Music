const { MessageEmbed } = require('discord.js');
const sendError = require('../util/error');

module.exports = {
  info: {
    name: 'nowplaying',
    description: 'Pour afficher la musique en cours de lecture',
    usage: '',
    aliases: ['np', 'encour', 'ec'],
  },

  run: async function (client, message, args) {
    const serverQueue = message.client.queue.get(message.guild.id);
    if (!serverQueue)
      return sendError(
        "Il n'y a aucune musique qui joue actuellement.",
        message.channel
      );
    let song = serverQueue.songs[0];
    dispatcher.setVolumeLogarithmic(queue.volume / 100);
    let thing = new MessageEmbed()
      .setAuthor(
        'Lecture en cour',
        'https://raw.githubusercontent.com/SudhanPlayz/Discord-MusicBot/master/assets/Music.gif'
      )
      .setThumbnail(song.img)
      .setColor('RANDOM')
      .addField('Nom', song.title, '\n')
      .addField('Durée', ':stopwatch: ' + song.duration, true)
      .addField('Volume', ':loud_sound: ' + queue.volume, true)
      .setFooter(`Vues: ${song.views} | Année: ${song.ago} | Par: ${song.req.tag}`);
    return message.channel.send(thing);
  },
};