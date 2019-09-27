export interface IUser {
	_id: string;
	displayName: string;
	email?: string;
	avatar: string;
	role: string;
	slug: string;
	jwtHandshake: string;
}

export interface INotification {
	_id: string;
	sender: IUser;
	receiver: IUser;
	content: string;
	type: string;
	ref: string;
	isRead: boolean;
}

export interface IChat {
	name: string;
	lastMessage: string;
	slug: string;
	_id: string;
	image: IFile;
	messages: IMessage[];
}

export interface IMention {
	indices: number[];
	displayName: string;
	slug: string;
	_id: string;
}

export interface IMessage {
	_id: string;
	text: string;
	file: IFile;
	createdBy: {
		_id: string;
		displayName: string;
		slug: string;
		avatar: string;
	};
	createdAt: Date;
	userMentions: IMention[];
	creationToken?: string;
	chatSlug: string;
}

export interface IFile {
	__typename: string;
	mimeType?: string;
	path: string;
	isStoredRemotely: boolean;
	dimensions: {
		width: number;
		height: number;
	};
}

export interface ITypingUser {
	displayName: string;
	slug: string;
}

export interface ITypingUsers {
	[key: string]: ITypingUser[];
}
