const Crawler = require('./crawler');
const logger = require('../arsco-common/logger');

//////////////////////////////////////////////////////////////

// Schedule.scheduleJob('35 * * * *', function(){
// 	try {
// 		console.log(new Date().toDateString());
// 		Crawler.start();
// 	} catch (error) {
		
// 	}
// })
console.log('xx');
Crawler.start();
setInterval(function(){
	Crawler.start();
}, 1800000); // 30 분마다 수집

logger.info('포스트 수집 스케줄러 시작');
