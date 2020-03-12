import { Validate } from '../Decorators';
// @ts-ignore
import validator from 'validator';

export const Trim = (chars?: string) => Validate({ transform: v => validator.trim(v, chars) });
