import {
	Arg,
	Ctx,
	Field,
	FieldResolver,
	Info,
	Int,
	Mutation,
	ObjectType,
	PubSub,
	PubSubEngine,
	Query,
	Resolver,
	Root,
	Subscription,
	UseMiddleware
} from 'type-graphql';
import { Chat } from '../entities/Chat';

@ObjectType()
export class PageInfo {
	@Field() hasNextPage?: boolean;
	@Field() hasPreviousPage?: boolean;
}

export interface IPageInfoFieldResolvers {
	hasNextPage(): Promise<boolean>;
	hasPreviousPage(): Promise<boolean>;
}

@Resolver(PageInfo)
class PageInfoResolver {
	@FieldResolver(type => Boolean)
	async hasNextPage(
		@Root() resolver: IPageInfoFieldResolvers
	): Promise<Boolean> {
		return await resolver.hasNextPage();
	}

	@FieldResolver(type => Boolean)
	async hasPreviousPage(
		@Root() resolver: IPageInfoFieldResolvers
	): Promise<Boolean> {
		return await resolver.hasPreviousPage();
	}
}

export default [PageInfoResolver];
