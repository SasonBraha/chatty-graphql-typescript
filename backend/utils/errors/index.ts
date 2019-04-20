export enum ErrorTypesEnum {
	BAD_REQUEST = 'BadRequest',
	UNAUTHORIZED = 'Unauthorized',
	FORBIDDEN = 'Forbidden',
	NOT_FOUND = 'NotFound',
	INTERNAL_SERVER_ERROR = 'InternalServerError'
}

export interface IErrorResponse {
	status: number;
	message: string;
}

export const ErrorResponse = {
	BadRequest: {
		status: 400,
		message: 'הבקשה אינה תקנית'
	},
	Unauthorized: {
		status: 401,
		message: 'עליך להיות מחובר/ת על מנת לבצע פעולה זו'
	},
	Forbidden: {
		status: 403,
		message: 'אין לחשבונך מספיק גישות על מנת לבצע פעולה זו'
	},
	NotFound: {
		status: 404,
		message: 'התוכן לא קיים במערכת'
	},
	InternalServerError: {
		status: 500,
		message: 'אופס! משהו השתבש'
	}
};

export default class CustomError extends Error {
	public status: number;
	public message: string;
	public detail: string;

	constructor(
		error: { status: number; message: string },
		detail: string = undefined,
		...args
	) {
		super(...args);
		this.status = error.status;
		this.message = error.message;
		this.detail = detail;
	}
}
