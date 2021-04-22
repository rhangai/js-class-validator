import { ClassValidator, Validator, ClassValidatorValidateOptions } from './ClassValidator';
import { Prototype, Class } from './Util';
import { ValidateError } from './Error';

/**
 * Storage for validators
 */
class ValidatorMetadataStorage<T> {
	private storageKey: symbol;
	private storage: Record<symbol, T> = {};

	constructor(storageKey?: symbol) {
		if (!storageKey) storageKey = Symbol('storage-key');
		this.storageKey = storageKey;
	}

	get(prop: symbol | any): T | undefined {
		const key = this.getKey(prop, false);
		if (!key) return;
		// @ts-ignore
		return this.storage[key];
	}

	set(prop: symbol | any, value: T): void {
		const key = this.getKey(prop, true);
		// @ts-ignore
		this.storage[key] = value;
	}

	/// Assert a new validator
	assert(prop: symbol | any, newValue: () => T): T {
		const key = this.getKey(prop, true);

		// @ts-ignore
		let value = this.storage[key];
		if (value == null) {
			value = newValue();
			// @ts-ignore
			this.storage[key] = value;
		}
		return value;
	}

	/// Get a new validator from key
	private getKey(prop: symbol | any, create: boolean): symbol | undefined {
		if (typeof prop === 'symbol') {
			return prop;
		}
		const target = prop;
		let key: symbol = Reflect.getOwnMetadata(this.storageKey, target);
		if (!key && create) {
			key = Symbol();
			Reflect.defineMetadata(this.storageKey, key, target);
		}
		return key;
	}
}
/**
 * Generate the validations metadata
 */
class ValidatorMetadata {
	private storage = new ValidatorMetadataStorage<ClassValidator>(Symbol('validator'));

	/// Add a validator to the prop
	add<T = any>(target: Class<T>, key: string, validator?: Validator) {
		const classValidator = this.getClassValidator(target);
		classValidator.add(key, validator);
	}

	/// Add a class validator to the target
	addClassValidator<T = any>(target: Class<T>, validator?: Validator) {
		const classValidator = this.getClassValidator(target);
		classValidator.addClassValidator(validator);
	}

	// Get the class validator for the class
	private getClassValidator<T = any>(target: Class<T>) {
		return this.storage.assert(
			target,
			() => new ClassValidator(target, () => this.storage.get(Object.getPrototypeOf(target)))
		);
	}

	/// Apply the validation using the metadata
	async validate<T>(classType: Class<T>, obj: any, options: ClassValidatorValidateOptions<T> = {}): Promise<T> {
		const classValidator = this.storage.get(classType);
		if (!classValidator) throw new ValidateError(`No metadata found for class ${classType.name}`, []);
		return await classValidator.validate(obj, options);
	}
}

export const validatorMetadata = new ValidatorMetadata();
