export type ValidateErrorItem = {
	error: Error;
	key?: string | null;
};
/**
 *
 */
export class ValidateError extends Error {
	public readonly errors: ValidateErrorItem[];

	constructor(message: string, errors: ValidateErrorItem[] = []) {
		message = ValidateError.buildErrorMessage(message, errors);
		super(message);
		this.errors = errors;
	}

	static buildErrorMessage(message: string, errors: ValidateErrorItem[]): string {
		if (errors.length > 0) {
			const errorMessages = errors.map(({ error, key }) => {
				const message = error.message.split('\n');
				for (let i = 1; i < message.length; ++i) {
					message[i] = `  ${message[i]}`;
				}
				if (key) return `- ${key}: ${message.join('\n')}`;
				return `- ${message.join('\n')}`;
			});
			message = `${message}\n  ${errorMessages.join('\n  ')}`;
		}
		return message;
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
