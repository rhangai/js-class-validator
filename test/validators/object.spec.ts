import { Trim } from '../../src/validators/sanitizer';
import { testValidator } from './lib';
import { IsObject, IsArray, IsArrayOf } from '../../src/validators/object';
import { Validate } from '../../src';
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

		it('nested', async () => {
			class TestClass {
				@Trim()
				name!: string;
			}

			await testValidator({
				validator: IsObject(_ => TestClass),
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
				@IsObject(obj => (obj.type === 'admin' ? AdminData : UserData))
				data!: UserData | AdminData;
				@Validate({ test: () => false })
				tooHardToValidate!: any;
			}

			await testValidator({
				validator: IsObject(_ => User, { skip: ['tooHardToValidate'] }),
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
				validator: IsObject(_ => TestClass),
				valids: [{ age: '10' }, { age: '20' }, { age: '30' }],
				invalids: [null, '', 'string', 10, undefined, [1, 2, 3], { notAge: 'john' }, { age: 'john' }],
			});
		});
	});
});
