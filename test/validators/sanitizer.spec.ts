import { Trim } from '../../src/validators/sanitizer';
import { testValidator } from './util';

describe('validator', () => {
	it('#trim', async () => {
		await testValidator({
			decorator: Trim,
			transforms: [{ value: '    rhangai', expected: 'rhangai' }],
		});
	});
});
