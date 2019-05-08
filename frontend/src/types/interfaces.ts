export interface IUser {
	_id: string;
	displayName: string;
	email?: string;
	avatar: string;
	role: string;
	slug: string;
	jwtHandshake: string;
}

export interface IChat {
	name: string;
	lastMessage: string;
	slug: string;
	_id: string;
	image: IFile;
	messages: IMessage[];
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
	isClientDeleted: boolean | null;
}

export interface IFile {
	__typename: string;
	mimeType?: string;
	path: string;
	isStored: boolean;
	dimensions: {
		width: number;
		height: number;
	};
}

export interface ITypingUser {
	displayName: string;
	slug: string;
}
