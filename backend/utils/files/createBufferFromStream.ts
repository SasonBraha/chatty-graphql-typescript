import { IFileInput } from '../../resolvers/inputs';

const createBufferFromStream = async (file: IFileInput) => {
	return new Promise((resolve, reject) => {
		const fileStream = file.createReadStream();
		const bufferChunks: Array<Buffer> = [];
		let completeBuffer = null;

		fileStream.on('data', (bufferChunk: Buffer) => {
			console.log('data');
			bufferChunks.push(bufferChunk);
		});

		fileStream.on('end', () => {
			completeBuffer = Buffer.concat(bufferChunks);
			resolve(completeBuffer);
		});
	});
};

export default createBufferFromStream;
