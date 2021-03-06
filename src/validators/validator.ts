import { Validate } from '../Decorators';
// @ts-ignore
import validator from 'validator';

export const Contains = (seed: string) => Validate({ test: v => validator.contains(v, seed) });
export const IsEqual = (value: any) => Validate({ test: v => v === value });
export const IsAfter = (date?: Date) => Validate({ test: v => validator.isAfter(v, date) });
export const IsBoolean = () => Validate({ test: v => v === true || v === false, message: 'Expected Boolean' });
export const IsNumber = () => Validate({ test: v => typeof v === 'number', message: 'Expected Number' });
export const IsInt = () =>
	Validate({ test: v => typeof v === 'number' && Number.isSafeInteger(v), message: 'Expected Integer' });
export const IsNumeric = () => Validate({ test: validator.isNumeric });
export const IsDecimal = () => Validate({ test: validator.isDecimal });
export const IsLength = (options: { min: number; max: number }) =>
	Validate({ test: v => validator.isLength(v, options) });
export const IsEmail = (options: unknown) => Validate({ test: v => validator.isEmail(v, options) });

export const IsEnum = <T extends { [key: string]: string | number }>(testEnum: T) =>
	Validate({ test: v => Object.values(testEnum).includes(v) });

export type IsStringOptions = {
	empty?: boolean;
};
export const IsString = (options: IsStringOptions = {}) =>
	Validate({
		message: 'Expected string',
		test: v => {
			if (typeof v !== 'string') return false;
			if (v.length <= 0 && options.empty !== true) {
				return false;
			}
			return true;
		},
	});
