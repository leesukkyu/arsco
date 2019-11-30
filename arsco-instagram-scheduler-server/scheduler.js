const LOGGER = require('../arsco-common/logger');
const crawler = require('./crawler');

crawler.start();
setInterval(function() {
  crawler.start();
}, 1800000); // 30 분마다 수집

LOGGER.info('포스트 수집 스케줄러 시작');
