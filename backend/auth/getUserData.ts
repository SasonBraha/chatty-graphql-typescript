import * as jwt from 'jsonwebtoken';

export default async (authToken: string) => {
	try {
		if (!authToken.startsWith('Bearer')) return null;
		const userData = await jwt.verify(
			authToken.split(' ')[1],
			process.env.JWT_SECRET
		);
		return userData;
	} catch (ex) {
		console.log(ex);
	}
};
