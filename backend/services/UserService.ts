import { User } from '../entities/User';
import { Notification } from '../entities/Notification';
import UserRepository from '../repositories/UserRepository';
import NotificationRepository from '../repositories/NotificationRepository';

const getUserBySlug = async (slug: string): Promise<User | null> => {
	return UserRepository.findBySlug(slug);
};

const searchUsers = async (
	displayName: string,
	limit?: number
): Promise<User[]> => {
	return UserRepository.searchByDisplayName(displayName, limit || 20);
};

const listNotifications = async (userId: string): Promise<Notification[]> => {
	return NotificationRepository.listForReceiver(userId);
};

const countUnreadNotifications = async (userId: string): Promise<number> => {
	return NotificationRepository.countUnreadForReceiver(userId);
};

const getUserById = async (id: string): Promise<User | null> => {
	return UserRepository.findById(id);
};

export default {
	getUserBySlug,
	searchUsers,
	listNotifications,
	countUnreadNotifications,
	getUserById
};
