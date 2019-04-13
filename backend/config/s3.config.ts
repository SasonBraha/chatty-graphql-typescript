import * as AWS from 'aws-sdk';

const s3 = new AWS.S3({
	accessKeyId: process.env.S3_ACCESS_KEY_ID,
	secretAccessKey: process.env.S3_SECRET_ACCESS_KEY,
	signatureVersion: 'v4',
	region: 'eu-central-1'
});

export default s3;
