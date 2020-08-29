const bind = require('../config/bind.json');
const colors = require('../config/colors.json');
const { Utils } = require('../utils/utils');

const data = require('./commands.json');
const { test } = require('./test');
const { help } = require('./help');
const { getmilitriss } = require('./getmilitriss');

const commandProfiler = (handler, message, entity) => {
  const { channels, bindColors } = entity['bind'].reduce((acc, bindName) => ({
    channels: [...acc.channels, bind.channels[bindName]],
    bindColors: [...acc.bindColors, colors.channels[bindName] || null],
  }), { channels: [], bindColors: [] });
  const color = bindColors[0] || colors.default;
  const newEntity = {
    ...entity,
    channels,
    color,
  };

  if (entity && Utils.isCommandChannelAccepted(message, newEntity)) {
    handler({ message, entity: newEntity });
  }
};

module.exports.commands = {
  test: { execute: (_bot, message, _args) => test({ message }) },
  help: { execute: (_bot, message, _args) => commandProfiler(help, message, data.help) },
  getmilitriss: { execute: (_bot, message, _args) => commandProfiler(getmilitriss, message, data.getmilitriss) },
};
