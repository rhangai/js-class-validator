import { ClassValidator, Validator } from './ClassValidator';
import { Prototype, Class } from './Util';

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

	private getKey(prop: symbol | any, create: boolean): symbol | undefined {
		if (typeof prop === 'symbol') {
			return prop;
		}
		const target = prop;
		let key: symbol = Reflect.getMetadata(this.storageKey, target);
		if (!key && create) {
			key = Symbol();
			Reflect.defineMetadata(this.storageKey, key, target);
		}
		return key;
	}
}
/**
 *
 */
class ValidatorMetadata {
	private storage = new ValidatorMetadataStorage<ClassValidator>(Symbol('validator'));

	add<T = any>(target: Class<T>, key: string, validator?: Validator) {
		const classValidator = this.storage.assert(target, () => new ClassValidator());
		if (validator) classValidator.add(key, validator);
	}

	addClassValidator<T = any>(target: Class<T>, validator: Validator) {
		const classValidator = this.storage.assert(target, () => new ClassValidator());
		classValidator.addClassValidator(validator);
	}

	async apply<T>(obj: Prototype<T>): Promise<T> {
		const classValidator = this.storage.get(obj.constructor);
		if (!classValidator) return obj;
		return await classValidator.apply(obj);
	}
}

export const validatorMetadata = new ValidatorMetadata();
