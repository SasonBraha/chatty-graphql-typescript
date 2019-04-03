import { ObjectType, Field, ID } from 'type-graphql';

@ObjectType()
export default class User {
	@Field(() => ID)
	_id: string;

	@Field()
	displayName: string;

	@Field()
	email: string;

	@Field()
	slug: string;

	@Field()
	avatar: string;

	@Field()
	role: string;

	@Field()
	lastActivity: string;
}
