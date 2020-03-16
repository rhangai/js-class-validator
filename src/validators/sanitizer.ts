import { Validate } from '../Decorators';
// @ts-ignore
import validator from 'validator';
import { parse } from 'fecha';

export const Trim = (chars?: string) =>
	Validate({ transform: v => (typeof v !== 'string' ? v : validator.trim(v, chars)) });
export const NormalizeEmail = (options: unknown) => Validate({ transform: v => validator.normalizeEmail(v, options) });
export const Blacklist = (chars: string) => Validate({ transform: v => validator.blacklist(v, chars) });
export const Whitelist = (chars: string) => Validate({ transform: v => validator.whitelist(v, chars) });

/**
 * Convert a string to a date format and keeps dates as is
 * @param formatIfString
 */
export const ToDate = (formatIfString: string = 'YYYY-MM-DD') =>
	Validate({
		transform(value, context) {
			if (value instanceof Date) return value;
			if (typeof value === 'string') {
				const date = parse(value, formatIfString);
				if (!date || isNaN(date.getTime())) throw context.createError(`Invalid date`);
				return date;
			}
			throw context.createError(`Invalid date`);
		},
	});

/**
 * Convert integers and string to int
 */
export const ToInt = () =>
	Validate({
		transform(value, context) {
			if (typeof value === 'string') {
				value = parseFloat(value);
			}
			if (typeof value !== 'number') throw context.createError(`Invalid number`);
			if (!Number.isSafeInteger(value)) throw context.createError(`Invalid number ${value}`);
			return value;
		},
	});
