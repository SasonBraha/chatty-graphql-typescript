import { Field, InputType } from 'type-graphql';
import { Stream } from 'stream';

@InputType()
export class CreateChatInput {
	@Field() name: string;

	@Field() isPrivate: boolean;

	@Field() storeMessages: boolean;
}

@InputType()
export class RegisterInput {
	@Field() displayName: string;

	@Field() email: string;

	@Field() password: string;
}

@InputType()
export class LoginInput {
	@Field() email: string;

	@Field() password: string;
}

export interface IFileInput {
	filename: string;
	mimetype: string;
	encoding: string;
	createReadStream: () => Stream;
}
