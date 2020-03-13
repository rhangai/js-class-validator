import { validatorMetadata } from './Metadata';
import { Class, Validated } from './Util';
import { ValidatorItem, normalizeValidatorArray } from './Decorators';
import { ClassValidator } from './ClassValidator';

/**
 * Performs the validation
 * @param classType The class type
 * @param objOrInstance The object or instance to validate
 */
export function validate<T extends {}>(classType: Class<T>, objOrInstance: T | object): Promise<Validated<T>> {
	return validatorMetadata.validate(classType, objOrInstance) as any;
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
