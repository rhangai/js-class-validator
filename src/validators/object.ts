import { Validate } from '../Decorators';
import { validatorMetadata } from '../Metadata';

/**
 * Validates a nested object
 * @param cb
 */
export function IsObject<T = any>(cb?: (obj: T) => any) {
	return Validate({
		transform: (value, context) => {
			if (cb == null) {
				if (typeof value === 'object' && value != null) {
					return value;
				}
				throw context.createError();
			}
			const classType = cb(context.object);
			if (classType === false) throw context.createError();
			if (classType == null) return undefined;
			return validatorMetadata.apply(classType, value);
		},
	});
}
