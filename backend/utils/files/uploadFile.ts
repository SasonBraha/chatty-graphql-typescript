import { IFileInput } from '../../resolvers/Chat/Chat.resolver.inputs';
import { createBufferFromStream, extractDataFromBuffer } from './index';
import { IFileData } from './extractDataFromBuffer';
import * as uuid from 'uuid';
import s3 from '../../config/s3.config';
import { IFile } from '../../models/File.model';

const uploadFile = (
	file: IFileInput,
	reference: string,
	maxFileSizeInKB: number = 5000
): Promise<IFile> => {
	return new Promise(async (resolve, reject) => {
		const fileBuffer: Buffer = await createBufferFromStream(file);
		const { mimeType, dimensions }: IFileData = extractDataFromBuffer(
			fileBuffer,
			maxFileSizeInKB
		);

		const uploadData = {
			Key: `${reference}/${uuid()}.${mimeType}`,
			Bucket: process.env.S3_BUCKET,
			Body: fileBuffer,
			ContentEncoding: 'base64',
			ContentType: mimeType
		};

		const fileData: IFile = {
			mimeType,
			path: uploadData.Key,
			isStored: true,
			dimensions
		};

		s3.putObject(uploadData, err => (err ? reject(err) : resolve(fileData)));
	});
};

export default uploadFile;
