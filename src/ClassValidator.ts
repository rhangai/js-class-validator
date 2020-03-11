export type Validator = {
	/// Test whether this property is valid or not
	test?: (value: any) => boolean | Promise<boolean>;
	/// If skips returns true, the validation will be skipped
	skip?: (value: any) => boolean | Promise<boolean>;
	/// Transform the property
	transform?: (value: any) => unknown | Promise<unknown>;
};

type ValidatorEntry = {
	validators: Validator[];
	skipClassValidator: boolean;
};

export class ClassValidator<T extends Record<string, any> = any> {
	private validators: Partial<Record<keyof T, ValidatorEntry>> = {};
	private classValidators: Validator[] = [];

	add<Key extends keyof T>(key: Key, validator: Validator) {
		const entry = this.getEntry(key);
		entry.validators.unshift(validator);
	}

	addClassValidator(validator: Validator) {
		this.classValidators.unshift(validator);
	}

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

	async apply(obj: T): Promise<T> {
		for (const key in obj) {
			const entry: ValidatorEntry | undefined = this.validators[key];
			obj[key] = await this.applyEntry(obj[key], entry);
		}
		return obj;
	}

	private async applyEntry<Value>(value: Value, entry: ValidatorEntry | undefined): Promise<Value> {
		if (!entry || !entry.skipClassValidator) {
			value = await this.applyChain(value, this.classValidators);
		}
		if (entry) {
			value = await this.applyChain(value, entry.validators);
		}
		return value;
	}

	private async applyChain<Value>(value: Value, validators: Validator[]): Promise<Value> {
		for (const validator of validators) {
			if (validator.transform) {
				value = (await validator.transform(value)) as any;
			}
			if (validator.test) {
				const isValid = await validator.test(value);
				if (!isValid) throw new Error(`Invalid`);
			}
			if (validator.skip) {
				const skip = await validator.skip(value);
				if (skip) break;
			}
		}
		return value;
	}
}
