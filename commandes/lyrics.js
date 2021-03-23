const { MessageEmbed } = require('discord.js');
const lyricsFinder = require('lyrics-finder');
const sendError = require('../util/error');

module.exports = {
  info: {
    name: 'lyrics',
    description: 'Obtenir les paroles de la chanson en cours de lecture',
    usage: '',
    aliases: ['parole', 'paroles', 'ly', 'pa'],
  },

  run: async function (client, message, args) {
    const queue = message.client.queue.get(message.guild.id);
    setTimeout(() => message.delete(), 3000);
    if (!queue)
      return sendError(
        "Il n'y a aucune musique qui joue actuellement.",
        message.channel
      ).catch(console.error);

    let lyrics = null;

    try {
      lyrics = await lyricsFinder(queue.songs[0].title, '');
      if (!lyrics)
        lyrics = `Aucune paroles trouvées pour \`\`${queue.songs[0].title}.\`\``;
    } catch (error) {
      lyrics = `Aucune paroles trouvées pour \`\`${queue.songs[0].title}.\`\``;
    }

    let lyricsEmbed = new MessageEmbed()
      .setAuthor(
        `${queue.songs[0].title} — Lyrics`,
        'https://raw.githubusercontent.com/SudhanPlayz/Discord-MusicBot/master/assets/Music.gif'
      )
      .setThumbnail(queue.songs[0].img)
      .setColor('YELLOW')
      .setDescription(lyrics)
      .setTimestamp();

    if (lyricsEmbed.description.length >= 2048)
      lyricsEmbed.description = `${lyricsEmbed.description.substr(0, 2045)}...`;
    return message.channel.send(lyricsEmbed).catch(console.error);
  },
};
