import { ClassValidator } from '../ClassValidator';
import { normalizeValidatorArray, Validate, ValidatorItem } from '../Decorators';
import { ValidateError, ValidateErrorItem } from '../Error';

/// Validate against
export const IsOptional = () => Validate({ skip: v => v == null });

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
					return await ClassValidator.validateItem(context.object, context.key, value, [validator]);
				} catch (error) {
					errors.push({ key: null, error });
				}
			}
			const message = ValidateError.buildErrorMessage('Must be OneOf', errors);
			throw context.createError(message);
		},
	});
};
