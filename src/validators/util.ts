import { ClassValidator, ValidatorContext } from '../ClassValidator';
import { normalizeValidatorArray, Validate, ValidatorItem } from '../Decorators';
import { ValidateError, ValidateErrorItem } from '../Error';

type ValidatorIsOptionalOption = {
	/**
	 * If the string is empty, mark it as null and skip validation.
	 */
	emptyStringAsNull?: boolean;
};
/**
 * Mark the field as optional, skipping the validation if it is null
 */
export function IsOptional(options?: ValidatorIsOptionalOption) {
	return Validate({
		skip(v) {
			if (v == null) {
				return { skip: true, value: null };
			}
			if (options?.emptyStringAsNull && v === '') {
				return { skip: true, value: null };
			}
			return false;
		},
	});
}

/// Optional only if a certain criteria is met
export function IsOptionalIf<T = unknown>(checkIsOptional: (obj: T, context: ValidatorContext<T>) => boolean) {
	return Validate({
		skip(v, context) {
			const isOptional = checkIsOptional(context.object, context);
			if (isOptional) return v == null;
			return false;
		},
	});
}

/**
 * Check if validation is one of
 * @param validators
 */
export const IsOneOf = (validators?: ValidatorItem | ValidatorItem[]) => {
	const normalizedValidators = normalizeValidatorArray(validators);
	return Validate({
		transform: async (value, context) => {
			const errors: ValidateErrorItem[] = [];
			for (const validator of normalizedValidators) {
				try {
					return await ClassValidator.validateItem(
						context.object,
						context.key,
						value,
						[validator],
						context.data
					);
				} catch (error) {
					errors.push({ key: null, error });
				}
			}
			const message = ValidateError.buildErrorMessage(`Passed ${JSON.stringify(value)}. Must be OneOf`, errors, {
				skipValue: true,
			});
			throw context.createError(message);
		},
	});
};
