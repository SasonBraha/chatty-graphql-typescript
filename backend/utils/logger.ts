import * as winston from 'winston';
import * as fs from 'fs';

const logDir = process.env.NODE_ENV === 'development' ? './logs' : 'logs';

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
			level: 'info',
			format: winston.format.combine(
				winston.format.timestamp(),
				winston.format.json({
					space: 2
				})
			)
		}),
		new (require('winston-daily-rotate-file'))({
			filename: `${logDir}/errors.log`,
			level: 'error',
			format: winston.format.combine(
				winston.format.timestamp(),
				winston.format.json({
					space: 2
				})
			)
		})
	]
});

export default logger;
