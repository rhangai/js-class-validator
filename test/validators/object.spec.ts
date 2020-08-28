import { Trim, ToInt } from '../../src/validators/sanitizer';
import { testValidator } from './lib';
import { IsObject, IsArray, IsArrayOf } from '../../src/validators/object';
import { Validate, IsOptional } from '../../src';
import { IsString, IsNumeric } from '../../src/validators/validator';

describe('Objects', () => {
	describe('#IsObject', () => {
		it('pure', async () => {
			class TestClass {}

			await testValidator({
				validator: IsObject(),
				valids: [{}, [], new TestClass()],
				invalids: [null, '', 'string', 10, undefined],
			});
		});

		it('data', async () => {
			class TestClass {
				@Trim()
				name!: string;

				@ToInt()
				age!: number;
			}

			await testValidator({
				validator: IsObject(
					() => TestClass,
					(_v, { data }) => ({
						preValidators: data.isOptional ? IsOptional() : [],
					})
				),
				transforms: [
					{
						value: { name: '   john', age: 100 },
						expected: { name: 'john', age: 100 },
						matchObject: true,
					},
					{
						value: { name: '   john', age: null },
						expected: { name: 'john' },
						matchObject: true,
						validatorOptions: {
							data: { isOptional: true },
						},
					},
					{
						value: { name: '   john', age: null },
						invalid: true,
					},
				],
			});
		});

		it('nested', async () => {
			class TestClass {
				@Trim()
				name!: string;
			}

			await testValidator({
				validator: IsObject(() => TestClass),
				transforms: [
					{
						value: { name: '   john' },
						expected: { name: 'john' },
						matchObject: true,
					},
				],
			});
		});

		it('nested advanced', async () => {
			class AdminData {
				@Trim()
				@IsString()
				adminField!: string;
			}

			class UserData {
				@Trim()
				@IsString()
				userField!: string;
			}

			class User {
				@Validate()
				@IsString()
				type!: 'admin' | 'user';
				@IsObject((obj) => (obj.type === 'admin' ? AdminData : UserData))
				data!: UserData | AdminData;
				@Validate({ test: () => false })
				tooHardToValidate!: any;
			}

			await testValidator({
				validator: IsObject(() => User, { skip: ['tooHardToValidate'] }),
				invalids: [
					// Invalid objects
					{ type: 'user', data: { adminField: '   john' } },
					{ type: 'admin', data: { notAdminField: '   john' } },
					{ type: 'admin', data: null },
					null,
					'',
					false,
					true,
				],
				transforms: [
					{
						value: { type: 'admin', data: { adminField: '   john' } },
						expected: { type: 'admin', data: { adminField: 'john' } },
						matchObject: true,
					},
					{
						value: { type: 'user', data: { userField: '   john' } },
						expected: { type: 'user', data: { userField: 'john' } },
						matchObject: true,
					},
				],
			});
		});

		it('child classes', async () => {
			class BaseData {
				@Trim()
				@IsString()
				baseField!: string;
			}

			class ChildData extends BaseData {
				@Trim()
				@IsString()
				childField!: string;
			}

			await testValidator({
				validator: IsObject(() => ChildData),
				invalids: [
					{
						baseField: {},
						childField: {},
					},
				],
				transforms: [
					{
						value: { baseField: '   base    ', childField: '    child          ' },
						expected: { baseField: 'base', childField: 'child' },
						matchObject: true,
					},
				],
			});
		});
	});

	describe('#IsArray', () => {
		it('simple', async () => {
			await testValidator({
				validator: IsArray([IsString()]),
				valids: [[], ['1', '2', '3']],
				invalids: [null, '', 'string', 10, undefined, [1, 2, 3]],
			});
		});

		it('array of objects', async () => {
			class TestClass {
				@IsString()
				name!: string;
			}

			await testValidator({
				validator: IsArrayOf(() => TestClass),
				valids: [[], [{ name: 'john' }, { name: 'doe' }, { name: 'mary' }]],
				invalids: [null, '', 'string', 10, undefined, [1, 2, 3], [{ notName: 'john' }]],
			});
		});
	});

	describe('#Validate', () => {
		it('validator as array', async () => {
			class TestClass {
				@Validate([IsString(), IsNumeric()])
				age!: string;
			}

			await testValidator({
				validator: IsObject(() => TestClass),
				valids: [{ age: '10' }, { age: '20' }, { age: '30' }],
				invalids: [null, '', 'string', 10, undefined, [1, 2, 3], { notAge: 'john' }, { age: 'john' }],
			});
		});
	});
});
