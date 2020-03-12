import { ValidateProp } from '../src/Decorators';
import { validate } from '../src';

describe('validator', () => {
	it('should validate', async () => {
		class TestDto {
			@ValidateProp()
			name!: string;
		}

		const dto = {
			name: 'rhangai',
		};
		const validated = await validate(TestDto, dto);
		expect(validated).toBeInstanceOf(TestDto);
		expect(validated).toHaveProperty('name', 'rhangai');
	});
});
