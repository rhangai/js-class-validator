import { Validate, ValidateDecorator } from '../Decorators';
import { validatorMetadata } from '../Metadata';
import { SYMBOL_VALIDATOR_DECORATOR, Class } from '../Util';
import { Validator, ClassValidator } from '../ClassValidator';
import { ValidateError, ValidateErrorItem } from '../Error';

/**
 * Validates an object
 * @param cb If provided, the callback
 */
export function IsObject<T = any>(cb?: (obj: T) => false | null | Class<T>) {
	return Validate({
		transform: (value, context) => {
			if (cb == null) {
				if (typeof value !== 'object' || value == null) {
					throw context.createError();
				}
				return value;
			}
			const classType = cb(context.object);
			if (classType === false) throw context.createError();
			if (classType == null) return undefined;
			return validatorMetadata.validate(classType, value);
		},
	});
}
/**
 * Validate an array
 */
export function IsArray<T = any>(validators?: Array<ValidateDecorator | Validator>) {
	return Validate({
		transform: async (value, context) => {
			if (!Array.isArray(value)) throw context.createError(`Must be an array`);
			if (!validators) return value;
			const validatorsNormalized: Validator[] = validators.map(v => {
				if (SYMBOL_VALIDATOR_DECORATOR in v) {
					// @ts-ignore
					return v[SYMBOL_VALIDATOR_DECORATOR];
				}
				return v;
			});

			const result = [];
			const errors: ValidateErrorItem[] = [];
			for (let i = 0; i < value.length; ++i) {
				try {
					result[i] = await ClassValidator.validateItem(value, `${i}`, value[i], validatorsNormalized);
				} catch (error) {
					errors.push({ key: `${i}`, error });
				}
			}
			if (errors.length > 0) throw new ValidateError(`Error validating array`, errors);
			return result;
		},
	});
}

export function IsArrayOf<T = any>(cb?: (obj: T) => false | null | Class<T>) {
	return IsArray([IsObject(cb)]);
}
