import { plainToClass } from 'class-transformer';
import { validatorMetadata } from './Metadata';
import { Class } from './Util';

/**
 * Performs the validation
 * @param classType The class type
 * @param objOrInstance The object or instance to validate
 */
export function validate<T = any>(classType: Class<T>, objOrInstance: T | object): Promise<T> {
	const instance: any = plainToClass(classType, objOrInstance, { excludeExtraneousValues: true });
	return validatorMetadata.apply(instance);
}
