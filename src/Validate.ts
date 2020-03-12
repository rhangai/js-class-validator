import { validatorMetadata } from './Metadata';
import { Class } from './Util';

/**
 * Performs the validation
 * @param classType The class type
 * @param objOrInstance The object or instance to validate
 */
export function validate<T = any>(classType: Class<T>, objOrInstance: T | object): Promise<T> {
	return validatorMetadata.apply(classType, objOrInstance);
}
