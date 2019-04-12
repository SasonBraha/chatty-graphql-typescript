import { IFileInput } from '../../resolvers/inputs';
import { createBufferFromStream, getFileDataFromBuffer } from './index';

const uploadFile = async (file: IFileInput) => {
	try {
		//@ts-ignore
		const fileBuffer: Buffer = await createBufferFromStream(file);
		const fileData = getFileDataFromBuffer(fileBuffer);

		return fileData;
	} catch (ex) {
		throw new Error(ex);
	}
};

export default uploadFile;
