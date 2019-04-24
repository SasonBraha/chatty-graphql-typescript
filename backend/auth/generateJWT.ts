import * as jwt from 'jsonwebtoken';
import { IUser } from '../models/User.model';
import { ErrorTypesEnum } from '../utils/errors';

const generateJWT = async (user: IUser) => {
	try {
		const {
			_id,
			displayName,
			email,
			avatar,
			jwtId: jwtHandshake,
			role,
			slug
		} = user;

		const authToken = await jwt.sign(
			{ displayName, email, avatar, jwtHandshake, role, slug, _id },
			process.env.JWT_SECRET,
			{ expiresIn: '10d' }
		);
		return authToken;
	} catch (ex) {
		throw new Error(ErrorTypesEnum.INTERNAL_SERVER_ERROR);
	}
};

export default generateJWT;
