import { ValidateError } from '../../src/Error';
import { validate } from '../../src';

type TestValidatorSpecTransform = {
	value: any;
	expected: any;
	matchObject?: boolean;
	test?: (value: any) => void | Promise<void>;
};

type TestValidatorSpec = {
	decorator: any;
	valids?: any[];
	invalids?: any[];
	transforms?: TestValidatorSpecTransform[];
};

export async function testValidator(spec: TestValidatorSpec) {
	class TestDto {
		@spec.decorator()
		value: any;
	}

	// Test for valid values
	const specValids = spec.valids ?? [];
	for (const validValue of specValids) {
		const dto = { value: validValue };
		const validated = await validate(TestDto, dto);
		expect(validated).toBeInstanceOf(TestDto);
	}

	// Test for invalid values
	const specInvalids = spec.invalids ?? [];
	for (const invalidValue of specInvalids) {
		const dto = { value: invalidValue };
		await expect(validate(TestDto, dto)).rejects.toBeInstanceOf(ValidateError);
	}

	// Must pass transformations
	const specTransforms = spec.transforms ?? [];
	for (const specTransform of specTransforms) {
		const dto = { value: specTransform.value };
		const validated = await validate(TestDto, dto);
		expect(validated).toBeInstanceOf(TestDto);
		if (specTransform.matchObject) {
			expect(validated.value).toMatchObject(specTransform.expected);
		} else {
			expect(validated.value).toBe(specTransform.expected);
		}
		if (specTransform.test) await specTransform.test(validated.value);
	}
}
