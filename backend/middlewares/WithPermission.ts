import { MiddlewareFn } from 'type-graphql';
import rolePermissions, {
	ChatPermissionTypesEnum,
	UserPermissionTypesEnum
} from '../permissions';
import { ErrorTypesEnum } from '../utils/errors';
import { IContext } from '../types/interfaces';

const withPermission = (
	targetPermission: ChatPermissionTypesEnum | UserPermissionTypesEnum
): MiddlewareFn<IContext> => async ({ context: { user } }, next) => {
	if (
		rolePermissions[user.role].includes(targetPermission as any) ||
		user.permissions.includes(targetPermission)
	) {
		return next();
	} else {
		throw new Error(ErrorTypesEnum.FORBIDDEN);
	}
};

export default withPermission;
