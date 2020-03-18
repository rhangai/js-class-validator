import { validatorMetadata } from './Metadata';
import { Class, Validated } from './Util';
import { ValidatorItem, normalizeValidatorArray } from './Decorators';
import { ClassValidator } from './ClassValidator';

export type ValidateOptions = {
	preValidators?: ValidatorItem | ValidatorItem[];
	postValidators?: ValidatorItem | ValidatorItem[];
};

/**
 * Performs the validation
 * @param classType The class type
 * @param objOrInstance The object or instance to validate
 */
export function validate<T extends {}>(
	classType: Class<T>,
	objOrInstance: T | object,
	options: ValidateOptions = {}
): Promise<Validated<T>> {
	return validatorMetadata.validate(classType, objOrInstance, {
		preValidators: normalizeValidatorArray(options.preValidators),
		postValidators: normalizeValidatorArray(options.postValidators),
	}) as any;
}

/**
 * Performs the validation
 * @param classType The class type
 * @param objOrInstance The object or instance to validate
 */
export async function validateValue<T = any>(
	value: any,
	validator?: ValidatorItem | ValidatorItem[]
): Promise<Validated<T>> {
	const normalizedValidators = normalizeValidatorArray(validator);
	return ClassValidator.validateItem(value, null, value, normalizedValidators);
}
