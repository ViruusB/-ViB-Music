const { MessageEmbed } = require('discord.js');
const sendError = require('../util/error');
const util = require("../util/pagination");
const chalk = require('chalk');

module.exports = {
  info: {
    name: 'queue',
    description: 'Pour afficher la liste des chansons en attente',
    usage: '',
    aliases: ['q', 'list', 'songlist', 'liste'],
  },

  run: async function (client, message, args) {
    console.log(`${(chalk.green(`${message.author.username}`))}` +' sur '+ (chalk.magenta(`${message.guild.name}`)) + ' salon ' + (chalk.magenta(`${message.channel.name}`))+' : ' + ' A ouvert la fonction [' + (chalk.cyan(`${message.author.lastMessage}`))+ ']')
    const permissions = message.channel.permissionsFor(message.client.user);
    setTimeout(() => message.delete(), 3000);
    if (!permissions.has(['MANAGE_MESSAGES', 'ADD_REACTIONS']))
      return sendError(
        "Il manque l'autorisation de gérer les messages ou d'ajouter des réactions",
        message.channel
      );

    const queue = message.client.queue.get(message.guild.id);
    if (!queue)
      return sendError(
        "Il n'y a aucune musique qui joue actuellement.",
        message.channel
      );

    const que = queue.songs.map((t, i) => `\`${++i}.\` | [\`${t.title}\`](${t.url}) - [<@${t.req.id}>]`);

    const chunked = util.chunk(que, 10).map((x) => x.join("\n"));

    const embed = new MessageEmbed()
    .setAuthor("Liste des Musiques", "https://raw.githubusercontent.com/ViruusB/-ViB-/main/assets/lecture.gif")
    .setThumbnail(message.guild.iconURL())
    .setColor("RANDOM")
    .setDescription(chunked[0])
    .addField("Lecture en cour", `[${queue.songs[0].title}](${queue.songs[0].url})`, true)
    .addField("Salon Texte", queue.textChannel, true)
    .addField("Salon Vocal", queue.voiceChannel, true)
    .addField('Volume :loud_sound:', queue.volume, true)
    .setFooter(`1 sur ${chunked.length}.`);
if (queue.songs.length === 1) embed.setDescription(`Aucune chanson est en attente \`\`${message.client.config.PREFIX}play <nom_de_la_musique> | <artiste> | <YouTube_URL>\`\``);

try {
    const queueMsg = await message.channel.send(embed);
    if (chunked.length > 1) await util.pagination(queueMsg, message.author, chunked);
} catch (e) {
    msg.channel.send(`Une erreur s'est produite: ${e.message}.`);
}
},
};
