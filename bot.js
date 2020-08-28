const Discord = require('discord.js');

const config = require('./config/config.json');
const { commands } = require('./commands/commands');

const bot = new Discord.Client();

bot.on('ready', () => {
  console.log(bot.user.username + ' started');
  bot.generateInvite(['SEND_MESSAGES']).then(link => console.log(link));
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
});

bot.login(config.token);
