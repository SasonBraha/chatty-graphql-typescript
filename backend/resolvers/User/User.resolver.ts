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
import { User, UserModel } from '../../entities/User';
import { Authenticated, WithPermission } from '../../middlewares';
import {
	IUserMentionedOutput,
	SearchUsersOutput
} from './user.resolver.outputs';
import { UserPermissionTypesEnum } from '../../permissions';
import { Notification, NotificationModel } from '../../entities/Notification';
import { SubscriptionTypesEnum } from '../../types/enums';

@Resolver(User)
export default class UserResolver {
	@UseMiddleware(Authenticated)
	@Query(returns => User)
	me(@Ctx('user') user: User): User {
		return user;
	}

	@Query(returns => User, { nullable: true })
	async user(@Arg('slug') slug: string) {
		const user = await UserModel.findOne({ slug }).lean();
		return user;
	}

	@UseMiddleware(Authenticated)
	@UseMiddleware(WithPermission([UserPermissionTypesEnum.SEARCH_USERS]))
	@Query(returns => SearchUsersOutput)
	async users(
		@Arg('displayName') displayName: string,
		@Arg('limit', () => Int, { nullable: true }) limit: number
	): Promise<SearchUsersOutput> {
		const userList: User[] = await UserModel.find({
			displayName: new RegExp(
				displayName.replace(/[-[\]{}()*+?.,\\^$|#\s]/, '\\$&'),
				'gi'
			)
		}).limit(limit ? limit : 20);

		return {
			userList
		};
	}

	@UseMiddleware(Authenticated)
	@Query(returns => [Notification])
	async notifications(@Ctx('user') user: User): Promise<Notification[]> {
		const notifications = await NotificationModel.find({
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
		@Ctx('user') user: User
	): string {
		return JSON.stringify(payload);
	}

	@UseMiddleware(Authenticated)
	@FieldResolver(returns => Int)
	async unreadNotificationsCount(@Root() user: User): Promise<number> {
		const unreadCount = await NotificationModel.countDocuments({
			receiver: user._id,
			isRead: false
		});
		return unreadCount;
	}

	@FieldResolver(returns => String, { nullable: true })
	email(@Root() user: User, @Ctx('user') currentUser: User): string {
		if (currentUser && currentUser.slug === user.slug) {
			return user.email;
		}
		return null;
	}
}
