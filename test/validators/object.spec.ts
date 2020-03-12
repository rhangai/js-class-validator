import { Trim } from '../../src/validators/sanitizer';
import { testValidator } from './util';
import { IsObject, IsArray } from '../../src/validators/object';
import { Validate } from '../../src';
import { IsString } from '../../src/validators/validator';

describe('validator', () => {
	describe('#IsObject', () => {
		it('pure', async () => {
			class TestClass {}

			await testValidator({
				decorator: IsObject,
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
				decorator: () => IsObject(_ => TestClass),
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
			}

			await testValidator({
				decorator: () => IsObject(_ => User),
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
				decorator: () => IsArray([IsString()]),
				valids: [[], ['1', '2', '3']],
				invalids: [null, '', 'string', 10, undefined, [1, 2, 3]],
			});
		});
	});
});
