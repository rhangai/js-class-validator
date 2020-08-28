import { IsOptional, IsOneOf, IsOptionalIf } from '../../src/validators/util';
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

	it('#IsOptionalIf', async () => {
		await testValidator({
			validator: [IsOptionalIf((_, { data }) => !!data.isOptional), IsString()],
			transforms: [
				{
					value: null,
					invalid: true,
				},
				{
					value: null,
					invalid: true,
					validatorOptions: { data: { isOptional: false } },
				},
				{
					value: null,
					validatorOptions: { data: { isOptional: true } },
				},
				{
					value: 'oi',
					expected: 'oi',
				},
				{
					value: 'oi',
					expected: 'oi',
					validatorOptions: { data: { isOptional: true } },
				},
			],
		});
	});
});
