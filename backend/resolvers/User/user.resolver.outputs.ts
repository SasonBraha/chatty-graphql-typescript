import { Field, ObjectType } from 'type-graphql';
import { IUser, UserEntity } from '../../models/User.model';

@ObjectType()
export class SearchUsersOutput {
	@Field(() => [UserEntity]) userList: IUser[];
	@Field() searchToken: string;
}
