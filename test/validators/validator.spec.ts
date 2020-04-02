import { IsNumeric, IsString, IsEnum, IsInt } from '../../src/validators/validator';
import { testValidator } from './lib';
import { validate, ValidateInput } from '../../src';

describe('Validators', () => {
	it('#IsNumeric', async () => {
		await testValidator({
			validator: IsNumeric(),
			valids: ['1', '100', '222'],
		});
	});

	it('#IsInt', async () => {
		await testValidator({
			validator: IsInt(),
			valids: [1, 2, 3, 4, 0, -1, -800],
			invalids: ['1', 1.2, 3.4, -1.22, -NaN, -Infinity, +Infinity, null, []],
		});
	});

	it('#IsString', async () => {
		await testValidator({
			validator: IsString(),
			valids: ['1', '100', '222'],
			invalids: [null, {}, undefined, '', true, false, []],
		});

		await testValidator({
			validator: IsString({ empty: true }),
			valids: ['1', '100', '222', ''],
			invalids: [null, {}, undefined, true, false, []],
		});
	});

	it('#IsEnum', async () => {
		enum MY_ENUM {
			MY_VALUE_1 = 'something',
			MY_VALUE_2 = 'other',
			MY_VALUE_3 = 3,
		}

		await testValidator({
			validator: [IsEnum(MY_ENUM)],
			valids: [3, 'something', 'other'],
			invalids: [1, 2, '3', null, {}],
		});
	});

	describe('#validate', () => {
		it('should skip props', async () => {
			class TestClass {
				@IsString()
				name!: string;
				@IsString()
				skipped!: string;
			}

			const input: ValidateInput<TestClass> = {
				name: 'John Doe',
			};
			const validObj = await validate(TestClass, input, { skip: ['skipped'] });
			expect(validObj.name).toBe('John Doe');
			expect(validObj.skipped).toBeUndefined();
		});
	});
});
