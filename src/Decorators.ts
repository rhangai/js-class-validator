import { validatorMetadata } from './Metadata';
import { Prototype, Class, SYMBOL_VALIDATOR_DECORATOR } from './Util';
import { Validator } from './ClassValidator';

export type ValidateDecorator<T = any> = {
	(prototypeOrClass: Prototype<T> | Class<T>, name?: string): void;
	[SYMBOL_VALIDATOR_DECORATOR]?: Validator;
};

/**
 * Validate a property
 * @param validator
 */
export function Validate<T = any>(validator?: Validator): ValidateDecorator<T> {
	const decorator: ValidateDecorator<T> = function(prototypeOrClass: Prototype<T> | Class<T>, name?: string) {
		if (isClassValidator(prototypeOrClass, name)) {
			validatorMetadata.addClassValidator(prototypeOrClass, validator);
		} else {
			validatorMetadata.add(prototypeOrClass.constructor, name!, validator);
		}
	};
	decorator[SYMBOL_VALIDATOR_DECORATOR] = validator;
	return decorator;
}

function isClassValidator<T>(prototypeOrClass: Prototype<T> | Class<T>, name?: string): prototypeOrClass is Class<T> {
	if (name == null) {
		if (typeof prototypeOrClass !== 'function') throw new Error(`@Validate must be applied to a class or a prop`);
		return true;
	}
	return false;
}
