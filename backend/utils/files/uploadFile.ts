import { IFileInput } from '../../resolvers/Chat/Chat.resolver.inputs';
import { createBufferFromStream, extractDataFromBuffer } from './index';
import { IFileData } from './extractDataFromBuffer';
import * as uuid from 'uuid';
import s3 from '../../services/s3';
import { File } from '../../entities/File';
import shortid = require('shortid');

const uploadFile = (
	file: IFileInput,
	reference: string,
	maxFileSizeInKB: number = 5000
): Promise<File> => {
	return new Promise(async (resolve, reject) => {
		const fileBuffer: Buffer = await createBufferFromStream(file);
		const { mimeType, dimensions }: IFileData = extractDataFromBuffer(
			fileBuffer,
			maxFileSizeInKB
		);

		const uploadData = {
			Key: `${reference}/${shortid.generate()}.${mimeType}`,
			Bucket: process.env.S3_BUCKET,
			Body: fileBuffer,
			ContentEncoding: 'base64',
			ContentType: mimeType
		};

		const fileData: File = {
			mimeType,
			path: uploadData.Key,
			isStoredRemotely: true,
			dimensions
		};

		s3.putObject(uploadData, err => (err ? reject(err) : resolve(fileData)));
	});
};

export default uploadFile;
