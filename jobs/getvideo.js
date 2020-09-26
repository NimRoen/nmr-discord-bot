const { google } = require('googleapis');
const moment = require('moment');
const fs = require('fs');
const { MessageEmbed } = require('discord.js');

const config = require('../config/config.json');
const colors = require('../config/colors.json');

const part = {
  SNIPPET: 'snippet',
  CONTENT_DETAILS: 'contentDetails',
};

const youtube = google.youtube({
  version: 'v3',
  auth: config.GAPIkey,
});

const channel = config.youtube;
const filetime = `lastUpdate-${channel}`;

const getData = (context, params, callback) => {
  youtube[context].list(params, (error, response) => {
    if (error) {
      console.log('ERROR: youtube API got error: ', error);
      return null;
    }

    if (!response) return null;

    callback(response.data);
  });
};

const jobLastTime = async () => {
  try {
    return moment(fs.readFileSync(filetime, 'utf8'));
  } catch (error) {
    return moment();
  }
};

const updateLastTime = () => {
  fs.writeFile(filetime, moment().toISOString(), error => {
    if (error) {
      console.log('ERROR: cannot write job last update time file');
    }
  });
};

module.exports.getVideo = {
  youtube: ({ bot, channelId }) => {
    jobLastTime().then(value => {
      const lastTime = value;
    
      getData('channels', {
        part: part.CONTENT_DETAILS,
        id: channel,
      }, data => {
        const playlistId = data.items[0].contentDetails.relatedPlaylists.uploads;
    
        if (playlistId) {
          getData('playlistItems', {
            part: part.CONTENT_DETAILS,
            playlistId,
            maxResults: 5,
          }, data => {
            data.items.map(({ contentDetails }) => {
              if (moment(contentDetails.videoPublishedAt).diff(lastTime) > 0) {
                const videoId = contentDetails.videoId;
                
                getData('videos', {
                  part: part.SNIPPET,
                  id: videoId,
                }, data => {
                  const { title, description, thumbnails } = data.items[0].snippet;
                  const shortDescription = description.split('*****')[0].trim();
    
                  const embedMessage = new MessageEmbed()
                  .setTitle(title)
                  .setColor(colors.channels.video)
                  .setAuthor('Let me Play | Video content', '', `https://youtube.com/channel/${channel}`)
                  .setImage(thumbnails['maxres'].url)
                  // .setThumbnail(embed.thumbnail)
                  .setDescription(`${shortDescription}\n\nhttps://youtu.be/${videoId}`);

                  bot.channels.fetch(channelId).then(value => {
                    value.send(embedMessage);
                  });
                });
              }
            });
          });
        }
      });
    
      updateLastTime();
    });
  },
};
