import { Field, ObjectType } from 'type-graphql';
import { User } from '../../entities/User.model';
import { Notification } from '../../entities/Notification.model';

@ObjectType()
export class SearchUsersOutput {
	@Field(() => [User]) userList: User[];
	@Field() searchToken: string;
}

export interface IUserMentionedOutput {
	notification: Notification;
}
