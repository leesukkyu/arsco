const winston = require('winston');
require('winston-daily-rotate-file');
require('date-utils');

const LOGGER = winston.createLogger({
  level: 'info',
  // 로그파일저장
  transports: [
    new winston.transports.DailyRotateFile({
      filename: '../logs/system.log',
      zippedArchive: false,
      format: winston.format.printf(
        info =>
          `${new Date().toFormat(
            'YYYY-MM-DD HH24:MI:SS',
          )} [${info.level.toUpperCase()}] - ${info.message}`,
      ),
    }),
    new winston.transports.Console({
      format: winston.format.printf(
        info =>
          `${new Date().toFormat(
            'YYYY-MM-DD HH24:MI:SS',
          )} [${info.level.toUpperCase()}] - ${info.message}`,
      ),
    }),
  ],
});

module.exports = LOGGER;
