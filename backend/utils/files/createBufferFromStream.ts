import { IFileInput } from '../../resolvers/Chat/Chat.resolver.inputs';

const createBufferFromStream = async (file: IFileInput): Promise<Buffer> => {
	return new Promise((resolve, reject) => {
		const fileStream = file.createReadStream();
		const bufferChunks: Uint8Array[] = [];
		let completeBuffer = null;

		fileStream.on('data', (bufferChunk: Buffer) => {
			bufferChunks.push(bufferChunk);
		});

		fileStream.on('end', () => {
			completeBuffer = Buffer.concat(bufferChunks);
			resolve(completeBuffer);
		});
	});
};

export default createBufferFromStream;
