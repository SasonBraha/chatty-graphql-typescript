import * as mongoose from 'mongoose';
import { redis } from './';
import { logger } from '../utils';
const execRef = mongoose.Query.prototype.exec;

//@ts-ignore
mongoose.Query.prototype.cache = function(options: { hashKey?: string } = {}) {
	this.withCache = true;
	this.hashKey = JSON.stringify(options.hashKey || '');

	return this;
};

mongoose.Query.prototype.exec = async function() {
	if (!this.withCache) {
		return execRef.apply(this, arguments);
	}

	const key = JSON.stringify({
		...this.getQuery(),
		collection: this.mongooseCollection.name
	});

	try {
		const cachedObject = await redis.hget(this.hashKey, key);

		if (cachedObject) {
			const parsedCache = JSON.parse(cachedObject);

			return Array.isArray(parsedCache)
				? parsedCache.map(doc => new this.model(doc))
				: new this.model(parsedCache);
		}

		const result = await execRef.apply(this, arguments);
		await redis.hset(this.hashKey, key, JSON.stringify(result));

		return result;
	} catch (ex) {
		logger.error(ex);
	}
};
