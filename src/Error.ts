/**
 *
 */
export class ValidateError extends Error {
	constructor(errors: any[]) {
		super();
	}
}

/**
 *
 */
export class ValidatePropError extends Error {
	constructor(key: string) {
		super(`Error validating prop ${key}`);
	}
}
