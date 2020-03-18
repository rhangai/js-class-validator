import { validatorMetadata } from './Metadata';
import { Prototype, Class, VALIDATOR_SYMBOL_DECORATOR } from './Util';
import { Validator, ClassValidator } from './ClassValidator';

export type ValidateDecorator<T = any> = {
	(prototypeOrClass: Prototype<T> | Class<T>, name?: string): void;
	[VALIDATOR_SYMBOL_DECORATOR]?: Validator;
};

export type ValidatorItem = ValidateDecorator | Validator;

/**
 * Validate a property
 * @param validator
 */
export function Validate<T = any>(validator?: ValidatorItem | ValidatorItem[]): ValidateDecorator<T> {
	const validatorNormalized = normalizeValidator(validator);
	const decorator: ValidateDecorator<T> = function(prototypeOrClass: Prototype<T> | Class<T>, name?: string) {
		if (isClassValidator(prototypeOrClass, name)) {
			validatorMetadata.addClassValidator(prototypeOrClass, validatorNormalized);
		} else {
			validatorMetadata.add(prototypeOrClass.constructor, name!, validatorNormalized);
		}
	};
	decorator[VALIDATOR_SYMBOL_DECORATOR] = validatorNormalized;
	return decorator;
}

/**
 * Validate a property
 * @param validator
 */
export function normalizeValidator<T = any>(validator?: ValidatorItem | ValidatorItem[]): Validator | undefined {
	if (!validator) return validator;
	if (Array.isArray(validator)) {
		const validatorArray = validator.map(extractValidator).filter(Boolean);
		return {
			transform: (value, context) => {
				return ClassValidator.validateItem(context.object, context.key, value, validatorArray);
			},
		};
	}
	return extractValidator(validator);
}
/**
 * Validate a property
 * @param validator
 */
export function normalizeValidatorArray(validator?: ValidatorItem | ValidatorItem[]): Validator[] {
	if (!validator) return [];
	if (Array.isArray(validator)) {
		return validator.map(extractValidator).filter(Boolean);
	}
	const v = extractValidator(validator);
	return v ? [v] : [];
}

function isClassValidator<T>(prototypeOrClass: Prototype<T> | Class<T>, name?: string): prototypeOrClass is Class<T> {
	if (name == null) {
		if (typeof prototypeOrClass !== 'function') throw new Error(`@Validate must be applied to a class or a prop`);
		return true;
	}
	return false;
}

/**
 * Extract a validator from an item
 * @param item The decorator or the validator
 */
function extractValidator(item: ValidatorItem): Validator {
	if (VALIDATOR_SYMBOL_DECORATOR in item) {
		// @ts-ignore
		return item[VALIDATOR_SYMBOL_DECORATOR];
	}
	// @ts-ignore
	return item;
}
