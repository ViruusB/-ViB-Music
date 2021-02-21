const { MessageEmbed } = require('discord.js');
const sendError = require('../util/error');

module.exports = {
  info: {
    name: 'leave',
    aliases: ['goaway', 'disconnect'],
    description: 'Quitter le channel vocal !',
    usage: 'Leave',
  },

  run: async function (client, message, args) {
    let channel = message.member.voice.channel;
    if (!channel)
      return sendError(
        'Je suis désolé mais vous devez être dans un canal vocal !',
        message.channel
      );
    if (!message.guild.me.voice.channel)
      return sendError('Je ne suis dans aucun canal vocal !', message.channel);

    try {
      await message.guild.me.voice.channel.leave();
    } catch (error) {
      await message.guild.me.voice.kick(message.guild.me.id);
      return sendError(
        'Essayer de quitter le canal vocal ...',
        message.channel
      );
    }

    const Embed = new MessageEmbed()
      .setAuthor(
        'Quitter le Vocal',
        'https://raw.githubusercontent.com/SudhanPlayz/Discord-MusicBot/master/assets/Music.gif'
      )
      .setColor('GREEN')
      .setTitle('Succès')
      .setDescription('🎶 Channel vocal quitté.')
      .setTimestamp();

    return message.channel
      .send(Embed)
      .catch(() => message.channel.send('🎶 Channel vocal quitté.'));
  },
};
