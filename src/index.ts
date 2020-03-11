import 'reflect-metadata';
import { validate } from './validate';
import { ValidateProp, ValidateClass } from './Metadata';

@ValidateClass()
class Test {
	@ValidateProp(_ => false)
	email?: string;
}

async function main() {
	const obj = {};
	await validate(Test, obj);
}

main();
