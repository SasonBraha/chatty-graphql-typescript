import { redis, RedisCategoriesEnum } from '../../services';
import { User } from '../../entities/User';

class ActiveUsersService {
	public async getUsers(chatSlug: string): Promise<User[]> {
		const userList = await redis.hget(
			RedisCategoriesEnum.ACTIVE_USERS,
			chatSlug
		);
		return userList ? JSON.parse(userList) : [];
	}

	private async updateUserList(
		userList: User[],
		chatSlug: string
	): Promise<void> {
		await redis.hset(
			RedisCategoriesEnum.ACTIVE_USERS,
			chatSlug,
			JSON.stringify(userList)
		);
	}

	public async addUser(chatSlug: string, userData: User): Promise<User[]> {
		const userList: User[] = await this.getUsers(chatSlug);
		userList.push({
			_id: userData._id,
			slug: userData.slug,
			avatar: userData.avatar,
			displayName: userData.displayName
		} as User);
		await this.updateUserList(userList, chatSlug);
		return userList;
	}

	public async removeUser(chatSlug: string, userData: User): Promise<User[]> {
		const userList = await this.getUsers(chatSlug);
		const updatedUserList = userList.filter(user => user._id != userData._id);
		await this.updateUserList(updatedUserList, chatSlug);
		return updatedUserList;
	}
}

const activeUsersService = new ActiveUsersService();
export default activeUsersService;
