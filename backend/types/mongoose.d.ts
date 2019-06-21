import { Document } from 'mongoose';

export {};

type CacheOptions = { key?: string };

declare module 'mongoose' {
	interface Query<T> {
		cache(options: CacheOptions): Query<T>;
		useCache: boolean;
		hashKey: string;
	}

	interface DocumentQuery<T, DocType extends Document, QueryHelpers = {}> {
		cache(options: CacheOptions): Query<any>;
	}
}
