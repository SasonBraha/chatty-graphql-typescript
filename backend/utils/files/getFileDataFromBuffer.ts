import * as fileType from 'file-type';
import * as sizeOf from 'buffer-image-size';

interface IFileData {
	fileExtension: string;
	mimeType: string;
	dimensions: {
		height: number;
		width: number;
		type: string;
	};
}

export default async (file: Buffer): Promise<IFileData> => {
	const allowedFileExtensions = ['jpg', 'jpeg', 'png', 'gif', 'webp', 'bmp'];

	// @ts-ignore
	const { ext: fileExtension, mime: mimeType } = fileType(file);
	const dimensions = sizeOf(file);

	return {
		fileExtension,
		mimeType,
		dimensions
	};
};
