import * as Redis from 'ioredis';

export enum RedisCategoriesEnum {
	ACTIVE_USERS = 'ACTIVE_USERS'
}

const redis = new Redis(process.env.REDIS_URL);
redis.flushall();

export default redis;
