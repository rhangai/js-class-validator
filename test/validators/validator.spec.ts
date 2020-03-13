import { IsNumeric, IsOptional, IsString, IsEnum } from '../../src/validators/validator';
import { testValidator } from './util';

describe('Validators', () => {
	it('#IsNumeric', async () => {
		await testValidator({
			validator: IsNumeric(),
			valids: ['1', '100', '222'],
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

	it('#IsOptional', async () => {
		await testValidator({
			validator: [IsOptional(), IsString()],
			valids: ['1', '100', null, undefined, '222'],
			invalids: [100, {}, []],
		});
	});
});
