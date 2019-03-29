import * as jwt from 'jsonwebtoken';
import { IUser } from '../models/User.model';

const generateJWT = async (user: IUser) => {
	try {
		const {
			displayName,
			email,
			avatar,
			jwtId: jwtHandshake,
			role,
			slug
		} = user;
		const authToken = await jwt.sign(
			{ displayName, email, avatar, jwtHandshake, role, slug },
			process.env.JWT_SECRET,
			{ expiresIn: '10d' }
		);
		return `Bearer ${authToken}`;
	} catch (ex) {
		console.log(ex);
	}
};

export default generateJWT;
