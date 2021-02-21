const { MessageEmbed } = require('discord.js');
const sendError = require('../util/error');

module.exports = {
  info: {
    name: 'volume',
    description: 'Pour modifier le volume de la musique.',
    usage: '[volume]',
    aliases: ['v', 'vol'],
  },

  run: async function (client, message, args) {
    const channel = message.member.voice.channel;
    if (!channel)
      return sendError(
        'Je suis désolé mais vous devez être dans un canal vocal pour écouter de la musique !',
        message.channel
      );
    const serverQueue = message.client.queue.get(message.guild.id);
    if (!serverQueue)
      return sendError(
        "Il n'y a rien qui joue sur ce serveur.",
        message.channel
      );
    if (!serverQueue.connection)
      return sendError(
        "Il n'y a rien qui joue sur ce serveur.",
        message.channel
      );
    if (!args[0])
      return message.channel.send(
        `Le volume actuel est de: **${serverQueue.volume} :loud_sound: **`
      );
    if (isNaN(args[0]))
      return message.channel
        .send(':notes: Chiffres uniquement !')
        .catch((err) => console.log(err));
    if (parseInt(args[0]) > 150 || args[0] < 0)
      return sendError(
        'Vous ne pouvez pas régler le volume à plus de 150 ou inférieur à 0',
        message.channel
      ).catch((err) => console.log(err));
    serverQueue.volume = args[0];
    serverQueue.connection.dispatcher.setVolumeLogarithmic(args[0] / 100);
    let xd = new MessageEmbed()
      .setDescription(`Volume réglé sur: **${args[0] / 1}/100**`)
      .setAuthor(
        'Gestion Du Volume',
        'https://raw.githubusercontent.com/SudhanPlayz/Discord-MusicBot/master/assets/Music.gif'
      )
      .setColor('BLUE');
    return message.channel.send(xd);
  },
};
