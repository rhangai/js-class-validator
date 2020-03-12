import { IsNumeric } from '../../src/validators/validator';
import { testValidator } from './util';

describe('validators', () => {
	it('#IsNumeric', async () => {
		await testValidator({
			decorator: IsNumeric,
			valids: ['1', '100', '222'],
		});
	});
});
