const { Utils } = require('../utils/utils');

module.exports.getmilitriss = ({ message, entity }) => {
  if ('image' in entity && 'db' in entity.image && 'name' in entity.image.db) {
    const { db } = entity.image;

    Utils.parseDB(db.name, results => {
      const { data } = results;

      if (!data) return;

      const randomId = parseInt(Math.random() * data.length);

      message.channel.send({ files: [data[randomId][db.src]] });
    });
  }
};
