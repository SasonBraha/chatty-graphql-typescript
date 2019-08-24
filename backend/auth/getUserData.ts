import * as jwt from 'jsonwebtoken';
import { ErrorTypesEnum } from '../utils/errors';
import { User, UserModel } from '../entities/User';
import { ObjectId } from 'mongodb';

export default async (authToken: string) => {
	try {
		if (!authToken) return null;
		if (!authToken.startsWith('Bearer')) {
			throw new Error();
		}
		const isTokenValid = (await jwt.verify(
			authToken.split(' ')[1],
			process.env.JWT_SECRET
		)) as User;
		if (!isTokenValid) throw new Error();

		const userData = isTokenValid;
		return await UserModel.findById(new ObjectId(userData._id)).cache({
			key: userData._id
		});
	} catch (ex) {
		throw new Error(ErrorTypesEnum.INVALID_TOKEN);
	}
};
