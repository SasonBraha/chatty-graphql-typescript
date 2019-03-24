import * as jwt from 'jsonwebtoken';

const generateJWT = async user => {
	try {
		const { displayName, email, avatar, jwtId: jwtHandshake } = user;
		const authToken = await jwt.sign(
			{ displayName, email, avatar, jwtHandshake },
			process.env.JWT_SECRET,
			{ expiresIn: '10d' }
		);
		return `Bearer ${authToken}`;
	} catch (ex) {
		console.log(ex);
	}
};

export default generateJWT;
