import { validatorMetadata } from './Metadata';
import { Prototype, Class } from './Util';
import { Validator } from './ClassValidator';
import { Expose, Type } from 'class-transformer';

export function ValidateClass(validator: Validator) {
	return function(target: Class<any>) {
		validatorMetadata.addClassValidator(target, validator);
	};
}

export function ValidateProp<T = any>(validator?: Validator) {
	return function(prototype: Prototype<T>, name: string) {
		validatorMetadata.add(prototype.constructor, name, validator);
		return Expose()(prototype, name);
	};
}

export function ValidateNested<T = any>(cb: (obj: T) => any) {
	const typeDecorator = Type(({ object }: any) => cb(object));
	return function(prototype: Prototype<T>, name: string) {
		validatorMetadata.add(prototype.constructor, name, {
			transform: value => validatorMetadata.apply(value),
		});
		return typeDecorator(prototype, name);
	};
}
