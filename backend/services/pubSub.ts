import { RedisPubSub } from 'graphql-redis-subscriptions';

const pubSub = new RedisPubSub({
	connection: {
		host: process.env.REDIS_HOST,
		port: process.env.REDIS_PORT
	}
});

export default pubSub;
