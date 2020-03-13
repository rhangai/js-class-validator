import { IsNumeric, IsString, IsEnum } from '../../src/validators/validator';
import { testValidator } from './lib';

describe('Validators', () => {
	it('#IsNumeric', async () => {
		await testValidator({
			validator: IsNumeric(),
			valids: ['1', '100', '222'],
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
});
