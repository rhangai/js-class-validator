import { Class } from './Util';
import { ValidateError, ValidatePropError, ValidateErrorItem } from './Error';

export type ValidatorContext<Value = any> = {
	data: Record<string, unknown>;
	object: any;
	originalValue: Value;
	key: string | null;
	createError: (message?: string) => Error;
};

export type Validator = {
	/// Test whether this property is valid or not
	test?: (value: any, context: Readonly<ValidatorContext>) => boolean | Promise<boolean>;
	/// Message when there is an error
	message?: string;
	/// If skips returns true, the validation will be skipped
	skip?: (value: any, context: Readonly<ValidatorContext>) => ValidatorSkipResult | Promise<ValidatorSkipResult>;
	/// Transform the property
	transform?: (value: any, context: Readonly<ValidatorContext>) => unknown | Promise<unknown>;
};

export type ValidatorSkipResult =
	| boolean
	| {
			skip: boolean;
			value?: any;
	  };

type ValidatorEntry = {
	validators: Validator[];
	skipClassValidator: boolean;
};

type ValidatorEntryState<Value> = {
	value?: Value;
	skip: boolean;
};

type ValidatorEntryApplyOptions<Value> = {
	context: ValidatorContext<Value>;
	entry: ValidatorEntry | undefined;
	preValidators?: Validator[];
	postValidators?: Validator[];
};

type ValidatorState = {
	input: any;
	output: any;
	errors: ValidateErrorItem[];
};

export type ClassValidatorValidateOptions<T> = {
	data?: Record<string, unknown>;
	skip?: Array<keyof T>;
	preValidators?: Validator[];
	postValidators?: Validator[];
};

/**
 * The class validator
 */
export class ClassValidator<T extends Record<string, any> = any> {
	private validators: Partial<Record<keyof T, ValidatorEntry>> = {};
	private classValidators: Validator[] = [];

	// Construct the class
	constructor(
		private readonly classType: Class<T>,
		private readonly parentValidatorGetter: (() => ClassValidator<any> | null | undefined) | null = null
	) {}

	/**
	 * Add a new entry validator
	 * @param key
	 * @param validator
	 */
	add<Key extends keyof T>(key: Key, validator?: Validator) {
		const entry = this.getEntry(key);
		if (validator) entry.validators.unshift(validator);
	}

	/**
	 * Add a new class validator
	 * @param validator
	 */
	addClassValidator(validator?: Validator) {
		if (validator) this.classValidators.unshift(validator);
	}

	/**
	 * Get the entry
	 * @param key
	 */
	private getEntry<Key extends keyof T>(key: Key) {
		let entry: ValidatorEntry | undefined = this.validators[key];
		if (!entry) {
			entry = {
				validators: [],
				skipClassValidator: false,
			};
			this.validators[key] = entry;
		}
		return entry;
	}

	/**
	 * Applies the validations
	 * @param obj
	 */
	async validate(obj: T, options: ClassValidatorValidateOptions<T>): Promise<T> {
		if (typeof obj !== 'object' || obj == null) {
			throw new Error(`obj must be an object`);
		}
		const state: ValidatorState = {
			errors: [],
			input: obj,
			output: {},
		};
		await this.validateState(state, options);
		const parentValidator = this.parentValidatorGetter?.();
		if (parentValidator) {
			const skip = Object.keys(state.output);
			await parentValidator.validateState(state, {
				...options,
				skip: options.skip ? [...options.skip, ...skip] : skip,
			});
		}
		if (state.errors.length > 0) throw new ValidateError(`Error validating ${this.classType.name}`, state.errors);
		Object.setPrototypeOf(state.output, this.classType.prototype);
		return Object.freeze(state.output);
	}

	/**
	 * Applies the validations on a raw object state
	 */
	private async validateState(state: ValidatorState, options: ClassValidatorValidateOptions<T>): Promise<void> {
		for (const key in this.validators) {
			if (options.skip && options.skip.indexOf(key) >= 0) continue;
			const entry: ValidatorEntry | undefined = this.validators[key];
			const originalValue = state.input[key];
			try {
				const value = await this.validateEntry({
					entry,
					preValidators: options.preValidators,
					postValidators: options.postValidators,
					context: {
						data: { ...options.data },
						object: state.input,
						originalValue,
						key,
						createError(message?: string) {
							return new ValidatePropError(key, message);
						},
					},
				});
				if (typeof value !== 'undefined') {
					state.output[key] = value;
				}
			} catch (error) {
				state.errors.push({ key, error, value: originalValue });
			}
		}
	}

	/**
	 * Applies the validation on a single entry
	 * @param options
	 */
	private async validateEntry<Value>(options: ValidatorEntryApplyOptions<Value>): Promise<Value | undefined> {
		const state: ValidatorEntryState<Value> = {
			value: options.context.originalValue,
			skip: false,
		};
		if (options.preValidators && options.preValidators.length > 0) {
			await ClassValidator.validateState(state, options.preValidators, options.context);
		}
		if (!options.entry || !options.entry.skipClassValidator) {
			await ClassValidator.validateState(state, this.classValidators, options.context);
		}
		if (options.entry) {
			await ClassValidator.validateState(state, options.entry.validators, options.context);
		}
		if (options.postValidators && options.postValidators.length > 0) {
			await ClassValidator.validateState(state, options.postValidators, options.context);
		}
		return state.value;
	}
	/**
	 * Validate a single item of a larger object using an stadalone validator
	 */
	static async validateItem<Value>(
		obj: any,
		key: string | null,
		value: Value,
		validators: Array<Validator | undefined>,
		data: Record<string, unknown>
	) {
		const state: ValidatorEntryState<Value> = {
			value,
			skip: false,
		};
		await ClassValidator.validateState(state, validators, {
			data,
			object: obj,
			originalValue: value,
			key,
			createError: (message?: string) => {
				return key ? new ValidatePropError(key, message) : new ValidateError(message ?? 'Error', []);
			},
		});
		return state.value;
	}
	/**
	 * Apply a chain of validators
	 */
	private static async validateState<Value>(
		state: ValidatorEntryState<Value>,
		validators: Array<Validator | undefined>,
		context: ValidatorContext<Value>
	) {
		for (const validator of validators) {
			if (!validator) continue;
			if (state.skip) return;
			if (validator.transform) {
				state.value = (await validator.transform(state.value, context)) as any;
			}
			if (validator.test) {
				const isValid = await validator.test(state.value, context);
				if (!isValid) throw context.createError(validator.message);
			}
			if (validator.skip) {
				const skipResult = await validator.skip(state.value, context);
				if (skipResult === true) {
					state.skip = true;
					state.value = void 0;
				} else if (skipResult && skipResult.skip) {
					state.skip = true;
					state.value = skipResult.value;
				}
			}
		}
	}
}
