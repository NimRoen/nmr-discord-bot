const Discord = require('discord.js');

const config = require('./config/config.json');
const bind = require('./config/bind.json');
const { jobManager } = require('./jobs/manager');
const { commands } = require('./commands/commands');
const { Utils } = require('./utils/utils');

const bot = new Discord.Client();

let autoEmojis = ['valenok', 'emoji_34', 'emoji_35', 'emoji_36'];
let autoReactionChannelIds = [bind.channels.video, bind.channels.test];

bot.on('ready', () => {
  console.log(bot.user.username + ' started');
  bot.generateInvite(['SEND_MESSAGES']).then(link => console.log(link));

  autoEmojis = bot.emojis.cache.filter(emoji => autoEmojis.includes(emoji.name));
  autoReactionChannelIds = Utils.getChannelIdsByNames({ bot, names: autoReactionChannelIds })

  jobManager.run(bot);
});

bot.on('message', msg => {
  if(msg.author.id !== bot.user.id) {
    const [commandWithPrefix, ...args] = msg.content.split(' ');
    const command = commandWithPrefix.substr(1);
    const isCommand = commandWithPrefix.startsWith(config.prefix) && command in commands;

    if(isCommand) {
      commands[command].execute(bot, msg, args);
    }
  }

  try {
    if (autoReactionChannelIds.length > 0 && autoReactionChannelIds.includes(msg.channel.id)) {
      autoEmojis.map(emoji => {
        msg.react(emoji);
      });
    }
  } catch {
    console.log(`Error: cannot add reaction of emoji with 'id: ${emoji.id}' and 'name: ${emoji.name}'`);
  }

});

bot.login(config.token);
