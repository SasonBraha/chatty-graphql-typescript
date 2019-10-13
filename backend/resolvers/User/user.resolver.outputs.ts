import { Field, ObjectType } from 'type-graphql';
import { User } from '../../entities/User';
import { Notification } from '../../entities/Notification';

@ObjectType()
export class SearchUsersOutput {
	@Field(() => [User]) userList: User[];
}

export interface IUserMentionedOutput {
	notification: Notification;
}
