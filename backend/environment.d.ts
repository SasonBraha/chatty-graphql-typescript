export {};

declare global {
	namespace NodeJS {
		interface ProcessEnv {
			JWT_SECRET: string;
			GOOGLE_TRANSLATE_API_KEY: string;
			S3_ACCESS_KEY_ID: string;
			S3_SECRET_ACCESS_KEY: string;
			S3_BUCKET: string;
			MONGO_URI: string;
			REDIS_URL: string;
			BASE_URL: string;
			GOOGLE_OAUTH_CLIENT_ID: string;
			GOOGLE_OAUTH_CLIENT_SECRET: string;
			GOOGLE_RECAPTCHA_SECRET_KEY: string;
			NODE_ENV: string;
			PORT: string;
		}
	}
}
