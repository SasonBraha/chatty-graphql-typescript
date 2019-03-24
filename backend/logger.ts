import * as winston from 'winston';
import DailyRotateFile = require('winston-daily-rotate-file');

const logger = winston.createLogger({
	level: 'error',
	format: winston.format.json(),
	transports: [
		new DailyRotateFile({
			filename: 'logs/%DATE%.log',
			datePattern: '.dd-MM-yyyy',
			level: 'error'
		})
	]
});

if (process.env.NODE_ENV === 'development') {
	logger.add(
		new winston.transports.Console({
			format: winston.format.simple()
		})
	);
}

export default logger;
