import { Validate } from '../src/Decorators';
import { validate } from '../src';

describe('validator', () => {
	it('should create instances of class from raw object', async () => {
		class TestDto {
			@Validate()
			name!: string;
		}

		const dto = {
			name: 'rhangai',
			unknownProp: 'test',
		};
		const validated = await validate(TestDto, dto);
		expect(validated).toBeInstanceOf(TestDto);
		expect(validated).toHaveProperty('name', 'rhangai');
		expect((validated as any).unknownProp).toBeUndefined();
	});

	it('should validate prop', async () => {
		class TestDto {
			@Validate({ test: v => typeof v === 'string' })
			name!: string;
		}

		const dto = {
			name: 'rhangai',
		};
		const validated = await validate(TestDto, dto);
		expect(validated).toBeInstanceOf(TestDto);
		expect(validated).toHaveProperty('name', 'rhangai');
	});

	it('should transform props', async () => {
		class TestDto {
			@Validate({ transform: v => `transformed:${v}` })
			name!: string;
		}

		const dto = {
			name: 'rhangai',
		};
		const validated = await validate(TestDto, dto);
		expect(validated).toBeInstanceOf(TestDto);
		expect(validated).toHaveProperty('name', 'transformed:rhangai');
	});

	it('should skip props', async () => {
		class TestDto {
			@Validate({ skip: v => v === 'rhangai' })
			name?: string;
			@Validate({ skip: v => ({ skip: v === 'invalid', value: null }) })
			age?: string | null;
		}

		const dto = {
			name: 'rhangai',
			age: 'invalid',
		};
		const validated = await validate(TestDto, dto);
		expect(validated).toBeInstanceOf(TestDto);
		expect(validated.name).toBeUndefined();
		expect(validated.age).toBeNull();
	});

	it('should validate class', async () => {
		@Validate({ transform: v => v.trim() })
		class TestDto {
			@Validate()
			name!: string;

			@Validate()
			job!: string;
		}

		const dto = {
			name: '    rhangai     ',
			job: '    programmer     ',
		};
		const validated = await validate(TestDto, dto);
		expect(validated).toBeInstanceOf(TestDto);
		expect(validated).toHaveProperty('name', 'rhangai');
		expect(validated).toHaveProperty('job', 'programmer');
	});
});
