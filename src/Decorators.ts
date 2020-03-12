import { validatorMetadata } from './Metadata';
import { Prototype, Class } from './Util';
import { Validator } from './ClassValidator';

/**
 * Validate a property
 * @param validator
 */
export function Validate<T = any>(validator?: Validator) {
	return function(prototypeOrClass: Prototype<T> | Class<T>, name?: string) {
		if (isClassValidator(prototypeOrClass, name)) {
			validatorMetadata.addClassValidator(prototypeOrClass, validator);
		} else {
			validatorMetadata.add(prototypeOrClass.constructor, name!, validator);
		}
	};
}

function isClassValidator<T>(prototypeOrClass: Prototype<T> | Class<T>, name?: string): prototypeOrClass is Class<T> {
	if (name == null) {
		if (typeof prototypeOrClass !== 'function') throw new Error(`@Validate must be applied to a class or a prop`);
		return true;
	}
	return false;
}
