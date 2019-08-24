import { Document } from 'mongoose';
import { IQueryCacheOptions } from './interfaces';

declare module 'mongoose' {
	interface Query<T> {
		cache(options: IQueryCacheOptions): Query<T>;
		useCache: boolean;
		hashKey: string;
	}

	interface DocumentQuery<T, DocType extends Document, QueryHelpers = {}> {
		cache(options: IQueryCacheOptions): Query<any>;
	}
}
