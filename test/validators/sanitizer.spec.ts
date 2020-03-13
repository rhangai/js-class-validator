import { Trim, ToDate } from '../../src/validators/sanitizer';
import { testValidator } from './lib';

describe('Sanitizers', () => {
	it('#trim', async () => {
		await testValidator({
			validator: Trim(),
			valids: [null, 100, {}],
			transforms: [{ value: '    rhangai', expected: 'rhangai' }],
		});
	});

	it('#ToDate', async () => {
		await testValidator({
			validator: ToDate(),
			valids: ['2020-02-28', new Date()],
			invalids: ['2020-02-31', null, '1000', 'TX'],
			transforms: [
				{
					value: '1234-11-20',
					async test(value: Date, spec) {
						expect(value.getDate()).toBe(20);
						expect(value.getMonth()).toBe(10);
						expect(value.getFullYear()).toBe(1234);
					},
				},
				{
					value: new Date(2222, 10, 30),
					async test(value: Date, spec) {
						expect(value.getDate()).toBe(30);
						expect(value.getMonth()).toBe(10);
						expect(value.getFullYear()).toBe(2222);
					},
				},
			],
		});
	});
});
