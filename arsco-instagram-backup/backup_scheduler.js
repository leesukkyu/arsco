require('module-alias/register');
const CONFIG = require('@Common/config');
const LOGGER = require('@Common/logger');

const backup = require('mongodb-backup');
const schedule = require('node-schedule');


// 일요일 오후 2시 30분 마다 DB 백업
schedule.scheduleJob({ hour: 14, minute: 30, dayOfWeek: 0 }, function(
  fireDate,
) {
  let date = new Date(fireDate);
  backup({
    uri: CONFIG.db.uri,
    root: `${__dirname}/dumps/`,
    tar: `${date.getFullYear()}_${date.getMonth()}_${date.getDate()}.tar`,
  });
});
LOGGER.info('데이터 베이스 백업 시작');
