import { Trim } from '../../src/validators/sanitizer';
import { testValidator } from './util';
import { IsObject } from '../../src/validators/object';
import { Validate } from '../../src';
import { IsString } from '../../src/validators/validator';

describe('validator', () => {
	it('#IsObject (pure)', async () => {
		class TestClass {}

		await testValidator({
			decorator: IsObject,
			valids: [{}, [], new TestClass()],
			invalids: [null, '', 'string', 10, undefined],
		});
	});

	it('#IsObject (nested)', async () => {
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

	it('#IsObject (advanced)', async () => {
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
			type!: 'admin' | 'user';
			@IsObject(obj => (obj.type === 'admin' ? AdminData : UserData))
			data!: UserData | AdminData;
		}

		await testValidator({
			decorator: () => IsObject(_ => User),
			invalids: [{ type: 'user', data: { adminField: '   john' } }, null, ''],
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
