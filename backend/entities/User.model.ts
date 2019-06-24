import { Document, Schema, model } from 'mongoose';
import * as bcrypt from 'bcryptjs';
import ObjectId = Schema.Types.ObjectId;
import { INotification } from './Notification.model';
import { ObjectType, Field, ID, Int } from 'type-graphql';
import rolePermissions from '../permissions';
import { ChatEntity, IChat } from './Chat.model';

export interface IUser extends Document {
	displayName: string;
	email: string;
	password: string;
	slug: string;
	avatar: string;
	notifications: Array<ObjectId> | Array<INotification>;
	role: 'Admin' | 'Moderator' | 'User';
	permissions: string[];
	excludedPermissions: string[];
	ipAddress: string;
	lastActivity: string;
	jwtId: string;
}

export interface IUserSchemaMethods extends IUser {
	comparePassword(password: string): boolean;
	hasPermission(permissions: string[]): boolean;
}

const UserSchema = new Schema(
	{
		displayName: {
			type: String,
			required: true,
			trim: true
		},
		email: {
			type: String,
			required: true,
			trim: true,
			lowercase: true
		},
		password: {
			type: String,
			trim: true
		},
		slug: {
			type: String,
			required: true,
			trim: true,
			lowercase: true
		},
		avatar: {
			type: String,
			trim: true,
			default: '/images/default_profile.svg'
		},
		notifications: {
			type: [Schema.Types.ObjectId],
			ref: 'Notification',
			select: false
		},
		role: {
			type: String,
			enum: ['Admin', 'Moderator', 'User'],
			default: 'User'
		},
		permissions: [String],
		excludedPermissions: [String],
		ipAddress: {
			type: String,
			required: true,
			trim: true,
			select: false
		},
		lastActivity: {
			type: Date
		},
		jwtId: {
			type: String,
			required: true
		}
	},
	{ timestamps: true }
);

@ObjectType()
export class UserEntity {
	@Field(() => ID)
	_id: string;

	@Field()
	displayName: string;

	@Field({ nullable: true })
	email: string;

	@Field()
	slug: string;

	@Field()
	avatar: string;

	@Field()
	role: string;

	@Field()
	lastActivity: string;

	@Field(type => Int)
	unreadNotificationsCount: number;

	@Field(type => [ChatEntity], { nullable: true })
	createdChatRooms: IChat[];
}

// Hash Password Before Saving
UserSchema.pre('save', async function(next) {
	const user = this as IUser;
	if (!user.isModified('password')) return next();
	const hash = await bcrypt.hash(user.password, 10);
	user.password = hash;
	next();
});

// Compare Password Method
UserSchema.methods.comparePassword = async function(candidatePassword) {
	try {
		const isMatch = await bcrypt.compare(candidatePassword, this.password);
		return Promise.resolve(isMatch);
	} catch (ex) {
		return Promise.reject(ex);
	}
};

// Has Permission
UserSchema.methods.hasPermission = function(targetPermissions: string[]) {
	const user = this as IUser;
	//prettier-ignore
	return (
		rolePermissions[user.role].some(permission => targetPermissions.includes(permission)) ||
		user.permissions.some(permission => targetPermissions.includes(permission))
	);
};

const User = model<IUserSchemaMethods>('User', UserSchema);
export default User;
