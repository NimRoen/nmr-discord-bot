const fs = require('fs');
const path = require('path');
const Papa = require('papaparse');

const getAllChannels = ({ bot, message }) => {
  const { cache } = bot ? bot.channels : message.guild.channels;

  return [...cache.keys()].map(key => {
    const channelEntity = cache.get(key);

    return [key, channelEntity.name];
  });
};

const getChannelIdsByNames = ({ bot, message, names }) => {
  const channels = getAllChannels({ bot, message });

  return channels.map(channel => {
    const [id, name] = channel;

    return (names.includes(name) || names.includes(id)) ? id : null;
  }).filter(id => id !== null);
};

const isCommandChannelAccepted = (message, commandEntity) => {
  const { channel } = message;
  const names = Object.keys(commandEntity).includes('channels') ? commandEntity.channels : [];

  return names.includes(channel.name) || names.includes(channel.id);
}

const parseDB = (filename, handler) => {
  const db = fs.readFileSync(path.resolve(__dirname, `../db/${filename}`));
  Papa.parse(db.toString(), {
    header: true,
    complete: results => handler(results),
  });
}

module.exports.Utils = {
  getAllChannels,
  getChannelIdsByNames,
  isCommandChannelAccepted,
  parseDB,
};
