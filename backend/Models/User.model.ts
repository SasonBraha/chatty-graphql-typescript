import { Document, Schema, model } from 'mongoose';
import * as bcrypt from 'bcryptjs';
import ObjectId = Schema.Types.ObjectId;
import { INotification } from './Notification.model';
import { ObjectType, Field, ID } from 'type-graphql';

export interface IUser extends Document {
	displayName: string;
	email: string;
	password: string;
	slug: string;
	avatar: string;
	notifications: Array<ObjectId> | Array<INotification>;
	role: 'Admin' | 'Moderator' | 'User';
	permissions: string[];
	ipAddress: string;
	lastActivity: string;
	jwtId: string;
}

interface ISchmeaMethods extends IUser {
	comparePassword(password: string): boolean;
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
			trim: true,
			select: false
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

	@Field()
	email: string;

	@Field()
	slug: string;

	@Field()
	avatar: string;

	@Field()
	role: string;

	@Field()
	lastActivity: string;
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

const User = model<ISchmeaMethods>('User', UserSchema);
export default User;
