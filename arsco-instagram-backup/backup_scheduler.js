require('module-alias/register');

const CONFIG = require('@Common/config');
const LOGGER = require('@Common/logger');

const backup = require('mongodb-backup');
const schedule = require('node-schedule');
const moment = require('moment-timezone');

// 일요일 오후 2시 30분 마다 DB 백업
schedule.scheduleJob({ hour: 23, minute: 42, dayOfWeek: 4 }, function () {
  var date = moment(new Date()).tz('Asia/Seoul');
  backup({
    uri: CONFIG.db.uri,
    root: `${__dirname}/dumps/`,
    tar: `${date.format('YYYY')}_${date.format('MM')}_${date.format('DD')}.tar`,
  });
});
LOGGER.info('데이터 베이스 백업 시작');
