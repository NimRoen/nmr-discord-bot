const { Utils } = require('../utils/utils');

const data = require('./commands.json');
const { test } = require('./test');
const { help } = require('./help');
const { getmilitriss } = require('./getmilitriss');

const commandProfiler = (handler, message, entity) => {
  if (entity && Utils.isCommandChannelAccepted(message, entity)) {
    const handlerProps = { message, entity };

    handler(handlerProps);
  }
};

module.exports.commands = {
  test: { execute: (_bot, message, _args) => test({ message }) },
  help: { execute: (_bot, message, _args) => commandProfiler(help, message, data.help) },
  getmilitriss: { execute: (_bot, message, _args) => commandProfiler(getmilitriss, message, data.getmilitriss) },
};
