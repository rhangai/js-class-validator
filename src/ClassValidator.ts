import { Class } from './Util';
import { ValidateError, ValidatePropError } from './Error';

export type ValidatorContext<Value = any> = {
	object: any;
	originalValue: Value;
	key: string;
	createError: () => Error;
};

export type Validator = {
	/// Test whether this property is valid or not
	test?: (value: any, context: ValidatorContext) => boolean | Promise<boolean>;
	/// If skips returns true, the validation will be skipped
	skip?: (value: any, context: ValidatorContext) => ValidatorSkipResult | Promise<ValidatorSkipResult>;
	/// Transform the property
	transform?: (value: any, context: ValidatorContext) => unknown | Promise<unknown>;
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
};

export class ClassValidator<T extends Record<string, any> = any> {
	private validators: Partial<Record<keyof T, ValidatorEntry>> = {};
	private classValidators: Validator[] = [];

	constructor(private readonly classType: Class<T>) {}

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
	 *
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
	async apply(obj: T): Promise<T> {
		const errors = [];
		const output: any = {};
		for (const key in this.validators) {
			const entry: ValidatorEntry | undefined = this.validators[key];
			try {
				const value = await this.applyEntry({
					entry,
					context: {
						object: obj,
						originalValue: obj[key],
						key,
						createError() {
							return new ValidatePropError(key);
						},
					},
				});
				if (typeof value !== 'undefined') {
					output[key] = value;
				}
			} catch (error) {
				errors.push({ key, error });
			}
		}
		if (errors.length > 0) throw new ValidateError(errors);
		Object.setPrototypeOf(output, this.classType.prototype);
		return output;
	}

	/**
	 * Applies the validation on a single entry
	 * @param options
	 */
	private async applyEntry<Value>(options: ValidatorEntryApplyOptions<Value>): Promise<Value | undefined> {
		const state: ValidatorEntryState<Value> = {
			value: options.context.originalValue,
			skip: false,
		};
		if (!options.entry || !options.entry.skipClassValidator) {
			await this.applyChain(state, this.classValidators, options);
		}
		if (options.entry) {
			await this.applyChain(state, options.entry.validators, options);
		}
		return state.value;
	}

	/**
	 * Apply a chain of validators
	 * @param value
	 * @param validators
	 * @param options
	 */
	private async applyChain<Value>(
		state: ValidatorEntryState<Value>,
		validators: Validator[],
		options: ValidatorEntryApplyOptions<Value>
	) {
		for (const validator of validators) {
			if (state.skip) return;
			if (validator.transform) {
				state.value = (await validator.transform(state.value, options.context)) as any;
			}
			if (validator.test) {
				const isValid = await validator.test(state.value, options.context);
				if (!isValid) throw options.context.createError();
			}
			if (validator.skip) {
				const skipResult = await validator.skip(state.value, options.context);
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
