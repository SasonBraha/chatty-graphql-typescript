import * as fileType from 'file-type';
import * as sizeOf from 'buffer-image-size';

export interface IFileData {
	fileExtension: string;
	mimeType: string;
	dimensions: {
		height: number;
		width: number;
	};
}

export default (file: Buffer, maxFileSizeInKB: number): IFileData => {
	const allowedImageTypes: string[] = ['jpg', 'jpeg', 'png', 'gif'];
	const allowedVideoTypes: string[] = ['mp4'];
	const allowedFileExtensions = [...allowedImageTypes, ...allowedVideoTypes];

	// @ts-ignore
	const fileSizeInKB: number = Math.floor(
		Buffer.byteLength(file, 'utf8') / 1024
	);
	// @ts-ignore
	const { ext: fileExtension, mime: mimeType } = fileType(file);
	const { type, height, width } = sizeOf(file);

	if (!allowedFileExtensions.includes(fileExtension)) {
		throw new Error('הקובץ לא נתמך במערכת');
	}

	if (fileSizeInKB > maxFileSizeInKB) {
		//prettier-ignore
		throw new Error(`הקובץ שנבחר גדול מדי, הגודל המירבי הניתן להעלאה הינו ${maxFileSizeInKB}KB`);
	}

	return {
		fileExtension,
		mimeType,
		dimensions: {
			height,
			width
		}
	};
};
