import * as winston from 'winston';
import * as fs from 'fs';

const logDir = process.env.NODE_ENV === 'development' ? '../logs' : 'logs';

if (!fs.existsSync(logDir)) {
	fs.mkdirSync(logDir);
}

const logger = winston.createLogger({
	transports: [
		new winston.transports.Console({
			format: winston.format.combine(
				winston.format.colorize(),
				winston.format.timestamp(),
				winston.format.align(),
				winston.format.simple()
			),
			level: 'info'
		}),
		new (require('winston-daily-rotate-file'))({
			filename: `${logDir}/info.log`,
			format: winston.format.combine(
				winston.format.timestamp(),
				winston.format.json()
			)
		}),
		new (require('winston-daily-rotate-file'))({
			filename: `${logDir}/errors.log`,
			level: 'error',
			format: winston.format.combine(
				winston.format.timestamp(),
				winston.format.json()
			)
		})
	]
});

export default logger;
