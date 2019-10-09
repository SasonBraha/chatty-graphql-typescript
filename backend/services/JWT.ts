import { ErrorTypesEnum } from '../utils/errors';
import * as jwt from 'jsonwebtoken';

class JWT {
	static async generateToken(
		payload: { [key: string]: any },
		asBearer: boolean,
		expiresIn: string
	) {
		try {
			let token = await jwt.sign(payload, process.env.JWT_SECRET, {
				expiresIn
			});
			if (asBearer) token = `Bearer ${token}`;
			return token;
		} catch (ex) {
			console.log(ex);
			throw new Error(ErrorTypesEnum.INTERNAL_SERVER_ERROR);
		}
	}

	static validateToken(token: string, isBearer?: boolean) {
		token = isBearer ? token.split(' ')[1] : token;
	}
}

export default JWT;
