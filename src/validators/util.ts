import { ClassValidator, ValidatorContext } from '../ClassValidator';
import { normalizeValidatorArray, Validate, ValidatorItem } from '../Decorators';
import { ValidateError, ValidateErrorItem } from '../Error';

/// Validate against
export const IsOptional = () => Validate({ skip: (v) => v == null });

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
