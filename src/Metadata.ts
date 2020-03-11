type ValidatorFunction<T = any> = (prop: T) => boolean | Promise<boolean>;

const VALIDATOR_SYMBOL = Symbol('validator');

class ValidatorMetadataType {
	private validators: Record<string, ValidatorFunction[]> = {};
}

/**
 *
 */
class ValidatorMetadata {
	private types: Record<string, ValidatorMetadataType> = {};
	add(prototype: any, key: string, validator: ValidatorFunction<any>) {
		const proto = Reflect.getMetadata('design:type', prototype);
		console.log(proto);
		const type = Reflect.getMetadata('design:type', prototype.constructor);
		console.log(type);
	}
}

export const validatorMetadata = new ValidatorMetadata();

export function ValidateClass() {
	return function<Target extends any = any>(target: Target) {
		// metadataAssertValidator(target.prototype);
	};
}
export function ValidateProp<PropType = any>(validator: ValidatorFunction<PropType>) {
	return function<Target extends any = any>(prototype: Target, name: string, descriptor?: any) {
		validatorMetadata.add(prototype, name, validator);
	};
}
