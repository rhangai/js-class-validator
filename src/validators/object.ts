import { Validate, ValidateDecorator, normalizeValidator, normalizeValidatorArray } from '../Decorators';
import { validatorMetadata } from '../Metadata';
import { VALIDATOR_SYMBOL_DECORATOR, Class } from '../Util';
import { Validator, ClassValidator } from '../ClassValidator';
import { ValidateError, ValidateErrorItem } from '../Error';
import { ValidatorContext } from '../ClassValidator';
import { ValidateOptions } from '../Validate';

type ValueOrValidateCallback<Options, T = unknown> = Options | ((obj: T, context: ValidatorContext<T>) => Options);

/**
 * Validates an object
 * @param cb If provided, the callback
 */
export function IsObject<T = any>(
	cb?: (obj: T) => false | null | Class<T>,
	validateOptions: ValueOrValidateCallback<ValidateOptions<T>> = {}
) {
	return Validate({
		transform: (value, context) => {
			if (cb == null) {
				if (typeof value !== 'object' || value == null) {
					throw context.createError();
				}
				return value;
			}

			let transformValidateOptions = validateOptions;
			if (typeof transformValidateOptions === 'function') {
				transformValidateOptions = transformValidateOptions(context.object, context);
			}

			const classType = cb(context.object);
			if (classType === false) throw context.createError();
			if (classType == null) return undefined;
			return validatorMetadata.validate(classType, value, {
				data: { ...context.data, ...transformValidateOptions.data },
				skip: transformValidateOptions.skip,
				preValidators: normalizeValidatorArray(transformValidateOptions.preValidators),
				postValidators: normalizeValidatorArray(transformValidateOptions.postValidators),
			});
		},
	});
}
/**
 * Validate an array
 */
export function IsArray<T = any>(validators?: Array<ValidateDecorator | Validator>) {
	const arrayValidator = normalizeValidatorArray(validators);
	return Validate({
		transform: async (value, context) => {
			if (!Array.isArray(value)) throw context.createError(`Must be an array`);
			if (!arrayValidator) return value;
			const result = [];
			const errors: ValidateErrorItem[] = [];
			for (let i = 0; i < value.length; ++i) {
				const originalValue = value[i];
				try {
					result[i] = await ClassValidator.validateItem(
						value,
						`${i}`,
						value[i],
						arrayValidator,
						context.data
					);
				} catch (error) {
					errors.push({ key: `${i}`, error, value: originalValue });
				}
			}
			if (errors.length > 0) throw new ValidateError(`Error validating array`, errors);
			return result;
		},
	});
}

/**
 * Validates an array of objects
 * @param cb
 */
export function IsArrayOf<T = any>(cb?: (obj: T) => false | null | Class<T>) {
	return IsArray([IsObject(cb)]);
}
