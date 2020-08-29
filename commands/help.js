const { MessageEmbed } = require('discord.js');

const config = require('../config/config.json');

const commands = require('./commands.json');

module.exports.help = ({ message, entity }) => {
  const { embed, commandListTitle, color } = entity;
  const embedMessage = new MessageEmbed()
    .setTitle(embed.title)
    .setColor(color)
    .setAuthor(embed.author.name)
    .setDescription(`${embed.description}\n\n**${commandListTitle}**${Object.keys(commands).reduce((acc, command) => {
      return `${acc}\n\`${config.prefix}${command}\` ${commands[command].about}`;
    }, '')}`)
    .setThumbnail(embed.thumbnail);

  message.channel.send(embedMessage);
};
