import { validateValue } from '../../src';

type TestValidatorSpecTransform = {
	value: any;
	expected?: any;
	matchObject?: boolean;
	invalid?: boolean;
	validatorOptions?: { data?: Record<string, unknown> };
	test?: (value: any, spec: TestValidatorSpecTransform) => void | Promise<void>;
};

type TestValidatorSpec = {
	validator: any;
	valids?: any[];
	invalids?: any[];
	transforms?: TestValidatorSpecTransform[];
};

export async function testValidator(spec: TestValidatorSpec) {
	const validator = spec.validator;
	// Test for valid values
	const specValids = spec.valids ?? [];
	for (const validValue of specValids) {
		await validateValue(validValue, validator);
	}

	// Test for invalid values
	const specInvalids = spec.invalids ?? [];
	for (const invalidValue of specInvalids) {
		await expect(validateValue(invalidValue, validator)).rejects.toBeInstanceOf(Error);
	}

	// Must pass transformations
	const specTransforms = spec.transforms ?? [];
	for (const specTransform of specTransforms) {
		if (specTransform.invalid) {
			await expect(
				validateValue(specTransform.value, validator, specTransform.validatorOptions)
			).rejects.toBeInstanceOf(Error);
			continue;
		}

		const validated = await validateValue(specTransform.value, validator, specTransform.validatorOptions);

		if (specTransform.test) {
			await specTransform.test(validated, specTransform);
		} else if (specTransform.matchObject) {
			expect(validated).toMatchObject(specTransform.expected);
		} else {
			expect(validated).toBe(specTransform.expected);
		}
	}
}
