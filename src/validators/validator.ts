import { ValidateProp } from '../Metadata';
// @ts-ignore
import validator from 'validator';

export const Contains = (seed: string) => ValidateProp({ test: v => validator.contains(v, seed) });
export const Equals = (comparision: string) => ValidateProp({ test: v => validator.equals(v, comparision) });
export const IsAfter = (date?: Date) => ValidateProp({ test: v => validator.isAfter(v, date) });
export const IsNumeric = ValidateProp({ test: validator.isNumeric });
