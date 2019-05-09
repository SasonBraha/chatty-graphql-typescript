import { Field, ObjectType } from 'type-graphql';

@ObjectType()
export class SuccessfulLoginOutput {
	@Field() authToken: string;
	@Field() shortAuthToken: string;
}
