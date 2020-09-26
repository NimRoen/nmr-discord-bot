const cron = require('node-cron');
const express = require('express');

const { Utils } = require('../utils/utils');
const bind = require('../config/bind.json');

const { getVideo } = require('./getvideo');

const app = express();

module.exports.jobManager = {
  run: bot => {
    const channelId = Utils.getChannelIdsByNames({
      bot,
      names: [bind.channels.video],
    })[0] || undefined;

    cron.schedule("* * * * *", () => {
      if (bot && channelId) {
        getVideo.youtube({ bot, channelId });
      }
    });

    app.listen(3128);
  },
}