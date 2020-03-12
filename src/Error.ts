export type ValidateErrorItem = {
	error: Error;
	key: string;
};
/**
 *
 */
export class ValidateError extends Error {
	public readonly errors: ValidateErrorItem[];

	constructor(message: string, errors: ValidateErrorItem[]) {
		const errorMessages = errors.map(({ error, key }) => {
			const message = error.message.split('\n');
			for (let i = 1; i < message.length; ++i) {
				message[i] = `  ${message[i]}`;
			}
			return `- ${key}: ${message.join('\n')}`;
		});
		super(`${message}\n  ${errorMessages.join('\n  ')}`);
		this.errors = errors;
	}
}

/**
 *
 */
export class ValidatePropError extends Error {
	constructor(key: string, message?: string) {
		super(message ?? `Error validating prop ${key}`);
	}
}