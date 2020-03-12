import { validatorMetadata } from './Metadata';
import { Class } from './Util';
import { ValidatorItem, normalizeValidatorArray } from './Decorators';
import { ClassValidator } from './ClassValidator';

/**
 * Performs the validation
 * @param classType The class type
 * @param objOrInstance The object or instance to validate
 */
export function validate<T = any>(classType: Class<T>, objOrInstance: T | object): Promise<T> {
	return validatorMetadata.validate(classType, objOrInstance);
}

/**
 * Performs the validation
 * @param classType The class type
 * @param objOrInstance The object or instance to validate
 */
export async function validateValue<T = any>(value: any, validator?: ValidatorItem | ValidatorItem[]): Promise<T> {
	const normalizedValidators = normalizeValidatorArray(validator);
	return ClassValidator.validateItem(value, null, value, normalizedValidators);
}
