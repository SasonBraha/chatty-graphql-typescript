import * as bcrypt from 'bcryptjs';
import { Field, ID, Int, ObjectType } from 'type-graphql';
import rolePermissions from '../permissions';
import {
	arrayProp as ArrayProperty,
	instanceMethod as InstanceMethod,
	InstanceType,
	pre as Pre,
	prop as Property,
	Ref,
	Typegoose
} from 'typegoose';
import { ObjectId } from 'mongodb';
import { Chat } from './Chat.model';

@ObjectType()
@Pre<User>('save', async function(next) {
	const user = this;
	if (user.isModified('password')) {
		user.password = await bcrypt.hash(user.password, 10);
	}
	next();
})
export class User extends Typegoose {
	@Field(type => ID)
	readonly _id: ObjectId;

	@Property({ required: true, trim: true })
	@Field()
	displayName!: string;

	@Property({ required: true, trim: true, lowercase: true })
	@Field()
	email!: string;

	@Property({ required: true, trim: true })
	@Field()
	password!: string;

	@Property({ required: true, trim: true, lowercase: true })
	@Field()
	slug!: string;

	@Property({ default: '/images/default_profile.svg' })
	@Field()
	avatar: string;

	@ArrayProperty({ itemsRef: Notification })
	@Field(type => Notification)
	notifications: Array<Ref<Notification>>;

	@Property({ default: 'User' })
	@Field()
	role: string;

	@ArrayProperty({ items: String })
	@Field(type => [String])
	permissions: string[];

	@ArrayProperty({ items: String })
	@Field(type => [String])
	excludedPermissions: string[];

	@Property({ required: true, select: false })
	@Field()
	ipAddress!: string;

	@Property({ default: new Date() })
	@Field()
	lastActivity: Date;

	@Property({ required: true, trim: true })
	@Field()
	jwtHandshake!: string;

	@Field(type => Int)
	unreadNotificationsCount: number;

	@Field(type => [Chat], { nullable: true })
	createdChatRooms: Array<Chat>;

	@Field()
	createdAt: Date;

	@InstanceMethod
	async comparePassword(candidatePassword) {
		try {
			const isMatch = await bcrypt.compare(candidatePassword, this.password);
			return Promise.resolve(isMatch);
		} catch (ex) {
			return Promise.reject(ex);
		}
	}

	@InstanceMethod
	hasPermission(this: InstanceType<User>, targetPermissions: string[]) {
		return (
			rolePermissions[this.role].some(permission =>
				targetPermissions.includes(permission)
			) ||
			this.permissions.some(permission =>
				targetPermissions.includes(permission)
			)
		);
	}
}

export const UserModel = new User().getModelForClass(User);
