require('module-alias/register');

const LOGGER = require('@Common/logger');
const schedule = require('node-schedule');

const crawler = require('./crawler');
crawler.start();
schedule.scheduleJob('30 * * * *', function () {
  crawler.start();
  LOGGER.info('수집기 동작');
});
LOGGER.info('포스트 수집 스케줄러 시작');
