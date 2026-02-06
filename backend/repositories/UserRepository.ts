import { User, UserModel } from '../entities/User';

const findBySlug = async (slug: string): Promise<User | null> => {
	return UserModel.findOne({ slug }).lean();
};

const findByEmail = async (email: string): Promise<User | null> => {
	return UserModel.findOne({ email });
};

const findByDisplayNames = async (displayNames: string[]): Promise<User[]> => {
	return UserModel.find({
		displayName: { $in: displayNames }
	}).select('displayName _id slug');
};

const searchByDisplayName = async (
	displayName: string,
	limit = 20
): Promise<User[]> => {
	return UserModel.find({
		displayName: new RegExp(
			displayName.replace(/[-[\]{}()*+?.,\\^$|#\s]/, '\\$&'),
			'gi'
		)
	}).limit(limit);
};

const findById = async (id: string): Promise<User | null> => {
	return UserModel.findById(id);
};

export default {
	findBySlug,
	findByEmail,
	findByDisplayNames,
	searchByDisplayName,
	findById
};
