import {
	Arg,
	Ctx,
	Int,
	Mutation,
	Query,
	Resolver,
	UseMiddleware
} from 'type-graphql';
import User, { IUser, UserEntity } from '../../entities/User.model';
import { Authenticated, WithPermission } from '../../middlewares';
import { SearchUsersOutput } from './user.resolver.outputs';
import * as jwt from 'jsonwebtoken';
import { UserPermissionTypesEnum } from '../../permissions';
import Notification, {
	INotification,
	NotificationEntity
} from '../../entities/Notification.model';

@Resolver(UserEntity)
export default class UserResolver {
	@UseMiddleware(Authenticated)
	@Query(returns => UserEntity)
	me(@Ctx('user') user: IUser): IUser {
		return user;
	}

	@UseMiddleware(WithPermission([UserPermissionTypesEnum.SEARCH_USERS]))
	@Query(returns => SearchUsersOutput)
	async users(
		@Arg('displayName') displayName: string,
		@Arg('limit', () => Int, { nullable: true }) limit: number
	): Promise<SearchUsersOutput> {
		const userList: IUser[] = await User.find({
			displayName: new RegExp(
				displayName.replace(/[-[\]{}()*+?.,\\^$|#\s]/, '\\$&'),
				'gi'
			)
		}).limit(limit ? limit : 20);

		const searchToken = await jwt.sign(
			{ userIds: userList.map(({ _id }) => _id) },
			process.env.JWT_SECRET,
			{ expiresIn: '7m' }
		);

		return {
			userList,
			searchToken
		};
	}

	@UseMiddleware(Authenticated)
	@Query(returns => [NotificationEntity])
	async notifications(@Ctx('user') user: IUser): Promise<INotification[]> {
		const notifications = await Notification.find({
			receiver: user._id
		}).populate('sender', 'displayName slug');
		return notifications.reverse();
	}
}
