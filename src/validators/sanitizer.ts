import { Validate } from '../Decorators';
// @ts-ignore
import validator from 'validator';

export const Trim = (chars?: string) =>
	Validate({ transform: v => (typeof v !== 'string' ? v : validator.trim(v, chars)) });
export const NormalizeEmail = (options: unknown) => Validate({ transform: v => validator.normalizeEmail(v, options) });
export const Blacklist = (chars: string) => Validate({ transform: v => validator.blacklist(v, chars) });
export const Whitelist = (chars: string) => Validate({ transform: v => validator.whitelist(v, chars) });
