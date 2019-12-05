require('module-alias/register');
const LOGGER = require('@Common/logger');
const schedule = require('node-schedule');

const crawler = require('./crawler');

crawler.start();
schedule.scheduleJob('30 * * * *', function(fireDate) {
  crawler.start();
  let date = new Date(fireDate);
  LOGGER.info(
    `${date.getFullYear()}_${date.getMonth()}_${date.getDate()}_${date.getMinutes()}_수집 시도함`,
  );
});
LOGGER.info('포스트 수집 스케줄러 시작');
