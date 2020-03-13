import { Validate } from '../Decorators';
// @ts-ignore
import validator from 'validator';

export const Contains = (seed: string) => Validate({ test: v => validator.contains(v, seed) });
export const IsEqual = (value: any) => Validate({ test: v => v === value });
export const IsAfter = (date?: Date) => Validate({ test: v => validator.isAfter(v, date) });
export const IsBoolean = () => Validate({ test: v => v === true || v === false, message: 'Expected boolean' });
export const IsNumber = () => Validate({ test: v => typeof v === 'number', message: 'Expected number' });
export const IsNumeric = () => Validate({ test: validator.isNumeric });
export const IsDecimal = () => Validate({ test: validator.isDecimal });
export const IsString = () => Validate({ test: v => typeof v === 'string', message: 'Expected string' });
export const IsLength = (options: { min: number; max: number }) =>
	Validate({ test: v => validator.isLength(v, options) });
export const IsEmail = (options: unknown) => Validate({ test: v => validator.isEmail(v, options) });

export const IsEnum = <T extends { [key: string]: string | number }>(testEnum: T) =>
	Validate({ test: v => Object.values(testEnum).includes(v) });
