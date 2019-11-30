const CONFIG = require('../config');
const LOGGER = require('../logger');

const mongoose = require('mongoose');

const connent = function() {
  mongoose
    .connect(CONFIG.db.uri, {
      useNewUrlParser: true,
      useFindAndModify: false,
    })
    .catch(error => {
      LOGGER.info('디비 연결 실패');
    });
  return mongoose;
};

const close = function() {
  mongoose.connection.close();
};

module.exports = {
  connect: connent,
  close: close,
};
