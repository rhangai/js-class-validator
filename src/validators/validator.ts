import { Validate } from '../Decorators';
// @ts-ignore
import validator from 'validator';

export const Contains = (seed: string) => Validate({ test: v => validator.contains(v, seed) });
export const Equals = (comparision: string) => Validate({ test: v => validator.equals(v, comparision) });
export const IsAfter = (date?: Date) => Validate({ test: v => validator.isAfter(v, date) });
export const IsNumeric = () => Validate({ test: validator.isNumeric });
