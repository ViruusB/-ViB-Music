const { MessageEmbed } = require('discord.js');
const lyricsFinder = require('lyrics-finder');
const sendError = require('../util/error');
const splitlyrics = require("../util/pagination");

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
    const splittedLyrics = splitlyrics.chunk(lyrics, 1024);

    let lyricsEmbed = new MessageEmbed()
      .setAuthor(
        `${queue.songs[0].title} — Lyrics`,
        'https://raw.githubusercontent.com/SudhanPlayz/Discord-MusicBot/master/assets/Music.gif'
      )
      .setThumbnail(queue.songs[0].img)
      .setColor('YELLOW')
      .setDescription(splittedLyrics[0])
      .setFooter(`1 sur ${splittedLyrics.length}.`)
      .setTimestamp();

      const lyricsMsg = await message.channel.send(lyricsEmbed);
      if (splittedLyrics.length > 1) await splitlyrics.pagination(lyricsMsg, message.author, splittedLyrics);
  },
};
