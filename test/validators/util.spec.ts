import { IsOptional, IsOneOf } from '../../src/validators/util';
import { testValidator } from './lib';
import { IsString, IsNumber } from '../../src';

describe('Utils', () => {
	it('#IsOneOf', async () => {
		await testValidator({
			validator: IsOneOf([IsNumber(), IsString()]),
			valids: ['1', '100', 100, 3522, '222'],
			invalids: [undefined, null, {}, []],
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
