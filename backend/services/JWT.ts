import { ErrorTypesEnum } from '../utils/errors';
import * as jwt from 'jsonwebtoken';

interface IPlainObject {
	[key: string]: any;
}

class JWT {
	static async generateToken(
		payload: IPlainObject,
		asBearer: boolean,
		expiresIn: string
	): Promise<string> {
		try {
			let token = await jwt.sign(payload, process.env.JWT_SECRET, {
				expiresIn
			});
			if (asBearer) token = `Bearer ${token}`;
			return token;
		} catch {
			throw new Error(ErrorTypesEnum.INTERNAL_SERVER_ERROR);
		}
	}

	static async validateTokenAndGetPayload<T>(
		token: string,
		isBearer?: boolean
	): Promise<T | null> {
		if (!token) return null;
		if (isBearer) {
			if (!token.startsWith('Bearer'))
				throw new Error(ErrorTypesEnum.INVALID_TOKEN);
			token = isBearer ? token.split(' ')[1] : token;
		}

		const payload = await jwt.verify(token, process.env.JWT_SECRET);
		if (payload) {
			return (payload as unknown) as T;
		} else {
			throw new Error(ErrorTypesEnum.INVALID_TOKEN);
		}
	}
}

export default JWT;
