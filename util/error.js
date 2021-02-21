const { MessageEmbed } = require('discord.js');

/**
 *
 * @param {String} text
 * @param {TextChannel} channel
 */
module.exports = async (text, channel) => {
  let embed = new MessageEmbed()
    .setColor('RANDOM')
    .setDescription(text)
    .setFooter('');
  await channel.send(embed);
};
