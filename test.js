const { google } = require('googleapis');
const moment = require('moment');
const fs = require('fs');

const config = require('./config/config.json');

const part = {
  SNIPPET: 'snippet',
  CONTENT_DETAILS: 'contentDetails',
};

const youtube = google.youtube({
  version: 'v3',
  auth: config.GAPIkey,
});

const channel = 'UCD2ydr9-agZAQBRhIONnydQ';

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
    return moment(fs.readFileSync('lastUpdate', 'utf8'));
  } catch (error) {
    return moment();
  }
};

const updateLastTime = () => {
  fs.writeFile('lastUpdate', moment().toISOString(), error => {
    if (error) {
      console.log('ERROR: cannot write job last update time file');
    }
  });
};

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
              const { title, description } = data.items[0].snippet;
              const shortDescription = description.split('*****')[0].split('\n')[0];

              console.log(shortDescription);
            });
          }
        });
      });
    }
  });

// updateLastTime();
});
