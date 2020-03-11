import { ValidateProp } from '../Decorators';
// @ts-ignore
import validator from 'validator';

export const Trim = (chars?: string) => ValidateProp({ transform: v => validator.trim(v, chars) });
