import { validatorMetadata } from './Metadata';
import { Class, Validated } from './Util';
import { ValidatorItem, normalizeValidatorArray } from './Decorators';
import { ClassValidator } from './ClassValidator';

export type ValidateOptions<T> = {
	skip?: Array<keyof T>;
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
	objOrInstance: Record<string, any>,
	options: ValidateOptions<T> = {}
): Promise<Validated<T>> {
	return validatorMetadata.validate(classType, objOrInstance, {
		skip: options.skip,
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
