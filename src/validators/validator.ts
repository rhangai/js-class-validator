import { Validate } from '../Decorators';
// @ts-ignore
import validator from 'validator';

export const Contains = (seed: string) => Validate({ test: v => validator.contains(v, seed) });
export const Equals = (comparision: string) => Validate({ test: v => validator.equals(v, comparision) });
export const IsAfter = (date?: Date) => Validate({ test: v => validator.isAfter(v, date) });
export const IsNumeric = () => Validate({ test: validator.isNumeric });
export const IsString = () => Validate({ test: v => typeof v === 'string', message: 'Expected string' });
export const IsLength = (options: { min: number; max: number }) =>
	Validate({ test: v => validator.isLength(v, options), message: 'Expected string' });
