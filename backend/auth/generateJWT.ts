import * as jwt from 'jsonwebtoken';
import { IUser } from '../models/User.model';

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
		return `${authToken}`;
	} catch (ex) {
		console.log(ex);
	}
};

export default generateJWT;
