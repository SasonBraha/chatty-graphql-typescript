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
import { User } from '../../entities/User';
import { Authenticated, WithPermission } from '../../middlewares';
import {
	IUserMentionedOutput,
	SearchUsersOutput
} from './user.resolver.outputs';
import { UserPermissionTypesEnum } from '../../permissions';
import { Notification } from '../../entities/Notification';
import { SubscriptionTypesEnum } from '../../types/enums';
import UserService from '../../services/UserService';

@Resolver(User)
export default class UserResolver {
	@UseMiddleware(Authenticated)
	@Query(returns => User)
	me(@Ctx('user') user: User): User {
		return user;
	}

	@Query(returns => User, { nullable: true })
	async user(@Arg('slug') slug: string) {
		return UserService.getUserBySlug(slug);
	}

	@UseMiddleware(Authenticated)
	@UseMiddleware(WithPermission([UserPermissionTypesEnum.SEARCH_USERS]))
	@Query(returns => SearchUsersOutput)
	async users(
		@Arg('displayName') displayName: string,
		@Arg('limit', () => Int, { nullable: true }) limit: number
	): Promise<SearchUsersOutput> {
		const userList: User[] = await UserService.searchUsers(displayName, limit);

		return {
			userList
		};
	}

	@UseMiddleware(Authenticated)
	@Query(returns => [Notification])
	async notifications(@Ctx('user') user: User): Promise<Notification[]> {
		return UserService.listNotifications(user._id.toString());
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
		return UserService.countUnreadNotifications(user._id.toString());
	}

	@FieldResolver(returns => String, { nullable: true })
	email(@Root() user: User, @Ctx('user') currentUser: User): string {
		if (currentUser && currentUser.slug === user.slug) {
			return user.email;
		}
		return null;
	}
}
