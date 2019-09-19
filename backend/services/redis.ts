import * as Redis from 'ioredis';

export enum RedisCategoriesEnum {
	ACTIVE_USERS = 'ACTIVE_USERS'
}

const redis = new Redis(process.env.REDIS_URI);
redis.on('connect', () => {
	console.log('Connected to Redis Successfully');
});

export default redis;
