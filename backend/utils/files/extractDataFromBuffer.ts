import * as fileType from 'file-type';
import * as sizeOf from 'buffer-image-size';

export interface IFileData {
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

	const fileSizeInKB: number = Math.floor(
		Buffer.byteLength(file, 'utf8') / 1024
	);

	// const { ext: fileExtension, mime: mimeType } = fileType(file); // For other files other than images
	const { type: mimeType, height, width } = sizeOf(file);

	if (!allowedFileExtensions.includes(mimeType)) {
		throw new Error('הקובץ לא נתמך במערכת');
	}

	if (fileSizeInKB > maxFileSizeInKB) {
		//prettier-ignore
		throw new Error(`הקובץ שנבחר גדול מדי, הגודל המירבי הניתן להעלאה הינו ${maxFileSizeInKB}KB`);
	}

	return {
		mimeType,
		dimensions: {
			height,
			width
		}
	};
};
