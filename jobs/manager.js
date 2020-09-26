const cron = require('node-cron');
const express = require('express');

const { Utils } = require('../utils/utils');
const bind = require('../config/bind.json');

const { getVideo } = require('./getvideo');

const app = express();

module.exports.jobManager = {
  run: bot => {
    const channelIds = Utils.getChannelIdsByNames({
      bot,
      names: [bind.channels.video, bind.channels.test],
    });

    // cron.schedule("* * * * *", () => {
    //   if (bot && channelIds.length > 0) {
        getVideo.youtube({ bot, channelIds });
    //   }
    // });

    // app.listen(3128);
  },
}