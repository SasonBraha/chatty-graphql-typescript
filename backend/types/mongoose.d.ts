export {};

declare global {
	namespace Mongoose {
		interface Query {
			cache: any;
		}
	}
}
