import * as Redis from 'ioredis';

export enum RedisCategoriesEnum {
	ACTIVE_USERS = 'ACTIVE_USERS'
}

const redis = new Redis({ host: 'redis' });

export default redis;
