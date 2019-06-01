import { Field, ObjectType } from 'type-graphql';
import { IUser, UserEntity } from '../../entities/User.model';
import { INotification } from '../../entities/Notification.model';

@ObjectType()
export class SearchUsersOutput {
	@Field(() => [UserEntity]) userList: IUser[];
	@Field() searchToken: string;
}

export interface IUserMentionedOutput {
	notification: INotification;
}
