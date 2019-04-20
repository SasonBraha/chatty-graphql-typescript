import redis, { RedisCategoriesEnum } from '../';
import { IUser } from '../../models/User.model';
import { ConnectionNotificationSet } from 'aws-sdk/clients/ec2';

class ActiveUsersService {
	private async getUsers(chatSlug: string): Promise<IUser[]> {
		const userList = await redis.hget(
			RedisCategoriesEnum.ACTIVE_USERS,
			chatSlug
		);
		return userList ? JSON.parse(userList) : [];
	}

	private async updateUserList(
		userList: IUser[],
		chatSlug: string
	): Promise<void> {
		await redis.hset(
			RedisCategoriesEnum.ACTIVE_USERS,
			chatSlug,
			JSON.stringify(userList)
		);
	}

	public async addUser(chatSlug: string, userData: IUser): Promise<IUser[]> {
		const userList: IUser[] = await this.getUsers(chatSlug);
		userList.push({
			_id: userData._id,
			slug: userData.slug,
			avatar: userData.avatar,
			displayName: userData.displayName
		} as IUser);
		await this.updateUserList(userList, chatSlug);
		return userList;
	}

	public async removeUser(chatSlug: string, userData: IUser): Promise<IUser[]> {
		const userList = await this.getUsers(chatSlug);
		const updatedUserList = userList.filter(user => user._id != userData._id);
		await this.updateUserList(updatedUserList, chatSlug);
		return updatedUserList;
	}
}

const activeUsersSerivce = new ActiveUsersService();
export default activeUsersSerivce;
