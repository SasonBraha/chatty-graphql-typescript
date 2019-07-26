import {
	Arg,
	Ctx,
	FieldResolver,
	Int,
	Query,
	Resolver,
	Root,
	Subscription,
	UseMiddleware
} from 'type-graphql';
import User, { IUser, UserEntity } from '../../entities/User.model';
import { Authenticated, WithPermission } from '../../middlewares';
import {
	IUserMentionedOutput,
	SearchUsersOutput
} from './user.resolver.outputs';
import * as jwt from 'jsonwebtoken';
import { UserPermissionTypesEnum } from '../../permissions';
import Notification, {
	INotification,
	NotificationEntity
} from '../../entities/Notification.model';
import { SubscriptionTypesEnum } from '../../types/enums';

@Resolver(UserEntity)
export default class UserResolver {
	@UseMiddleware(Authenticated)
	@Query(returns => UserEntity)
	me(@Ctx('user') user: IUser): IUser {
		return user;
	}

	@Query(returns => UserEntity, { nullable: true })
	async user(@Arg('slug') slug: string, @Ctx('user') user: IUser) {
		const isTargetUserSameIsLoggedInUser = user ? user.slug === slug : false;
		return User.findOne({ slug }).select(
			isTargetUserSameIsLoggedInUser ? '+email' : '-email'
		);
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
		})
			.populate('sender', 'displayName slug')
			.sort({ createdAt: -1 })
			.limit(10);
		return notifications;
	}

	@UseMiddleware(Authenticated)
	@Subscription(returns => String, {
		topics: SubscriptionTypesEnum.USER_MENTIONED,
		filter: ({ payload, context }) =>
			payload.userId.toString() === context.user._id.toString()
	})
	userUpdates(
		@Root() payload: IUserMentionedOutput,
		@Ctx('user') user: IUser
	): string {
		return JSON.stringify(payload);
	}

	@UseMiddleware(Authenticated)
	@FieldResolver(returns => Int)
	async unreadNotificationsCount(@Root() user: IUser): Promise<number> {
		const unreadCount = await Notification.countDocuments({
			receiver: user._id,
			isRead: false
		});
		return unreadCount;
	}
}
