import { MiddlewareFn } from 'type-graphql';
import rolePermissions, {
	ChatPermissionTypesEnum,
	UserPermissionTypesEnum
} from '../permissions';
import { ErrorTypesEnum } from '../utils/errors';
import { IContext } from '../types/interfaces';

const withPermission = (
	targetPermissions: ChatPermissionTypesEnum[] | UserPermissionTypesEnum[]
): MiddlewareFn<IContext> => async ({ context: { user } }, next) => {
	if (
		rolePermissions[user.role].some(permission =>
			targetPermissions.includes(permission as never)
		) ||
		user.permissions.some(permission =>
			targetPermissions.includes(permission as never)
		)
	) {
		return next();
	} else {
		throw new Error(ErrorTypesEnum.FORBIDDEN);
	}
};

export default withPermission;
