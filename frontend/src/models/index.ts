export interface IUser {
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
	image: {
		link: string;
		isUploaded: boolean;
	};
}
