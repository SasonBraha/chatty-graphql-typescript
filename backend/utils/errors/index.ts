export enum ErrorTypesEnum {
	BAD_REQUEST = 'BadRequest',
	UNAUTHORIZED = 'Unauthorized',
	FORBIDDEN = 'Forbidden',
	NOT_FOUND = 'NotFound',
	INTERNAL_SERVER_ERROR = 'InternalServerError',
	INVALID_TOKEN = 'InvalidToken',
	_INTERNAL_JWT_VERIFY_ERROR = 'Context creation failed: InvalidToken'
}

export interface IErrorContext {
	status: number;
	message: string;
}

interface IError {
	[key: string]: IErrorContext;
}

export const ErrorResponse: IError = {
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
	},
	InvalidToken: {
		status: 401,
		message: 'הייתה בעיה באימות הטוקן'
	},
	'Context creation failed: InvalidToken': {
		status: 401,
		message: 'הייתה בעיה באימות הטוקן'
	}
};

export default class CustomError extends Error {
	public status: number;
	public message: string;
	public detail: string;
	public formValidation;

	constructor(
		error: { status: number; message: string },
		detail: string = undefined,
		formValidation?: string,
		...args
	) {
		super(...args);
		this.status = error.status;
		this.message = error.message;
		this.detail = detail;
		this.formValidation = formValidation;
	}
}
