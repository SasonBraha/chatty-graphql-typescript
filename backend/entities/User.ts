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
import { Chat } from './Chat';
import { Notification } from './Notification';
import * as shortid from 'shortid';
import { Request } from 'express';
import { Document } from 'mongoose';
import * as uuid from 'uuid';

@ObjectType()
@Pre<User>('save', async function(next) {
	const user = this;
	const isUserModifiedPassword = user.isModified('password');
	if (isUserModifiedPassword) {
		user.password = await bcrypt.hash(user.password, 10);
	}
	next();
})
export class User extends Typegoose {
	@Field(type => ID)
	readonly _id: ObjectId;

	@Field()
	@Property({ required: true, trim: true })
	displayName!: string;

	// Email will be set to `null` on unauthorized requests.
	@Field({ nullable: true })
	@Property({ required: true, trim: true, lowercase: true })
	email!: string;

	@Property({ trim: true })
	password: string;

	@Field()
	@Property({ required: true, trim: true, lowercase: true })
	slug!: string;

	@Field()
	@Property({ default: '/images/default_profile.svg' })
	avatar: string;

	@Field(type => Notification)
	@ArrayProperty({ itemsRef: { name: 'Notification' } })
	notifications: Array<Ref<Notification>>;

	@Field()
	@Property({ default: 'User' })
	role: string;

	@Field(type => [String])
	@ArrayProperty({ items: String })
	permissions: string[];

	@Field(type => [String])
	@ArrayProperty({ items: String })
	excludedPermissions: string[];

	@Field()
	@Property({ required: true, select: false })
	ipAddress!: string;

	@Field()
	@Property({ default: new Date() })
	lastActivity: Date;

	@Property({ required: true, trim: true })
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

export const UserModel = new User().getModelForClass(User, {
	schemaOptions: { timestamps: true }
});

export class UserController {
	static async createUser(
		data: Partial<User>,
		request: Request
	): Promise<User & Document> {
		try {
			const newUser = await UserModel.create({
				...data,
				slug: `${data.displayName}@${shortid.generate()}`,
				ipAddress:
					request.headers['x-forwarded-for'] ||
					request.connection.remoteAddress,
				jwtHandshake: uuid()
			});

			return newUser;
		} catch (ex) {
			throw new Error(ex);
		}
	}
}
