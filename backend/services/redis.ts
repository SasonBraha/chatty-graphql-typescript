import * as Redis from 'ioredis';

export enum RedisCategoriesEnum {
	ACTIVE_USERS = 'ACTIVE_USERS'
}

const redis = new Redis({
	host: process.env.REDIS_HOST,
	port: process.env.REDIS_PORT
});
redis.on('connect', () => {
	console.log('Connected to Redis Successfully');
});

export default redis;
