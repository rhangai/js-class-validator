# @rhangai/class-validator

## Getting started

```sh
yarn add @rhangai/class-validator
```

Use it

```ts
import { Validate, validade, Trim } from '@rhangai/class-validator';

@Trim()
export class UserDto {
	@Validate()
	name!: string;
	@Validate()
	address!: string;
}
const obj = {
	name: '   john doe',
};
const user = await validate(UserDto, obj);
```

## Validators

-   `IsObject()` Check if the property is an object of the given type
-   `IsObject(() => Type)` Check if the property is validated against a given type
-   `IsArray([ ...Validators ])` Check if the property is an array of the validators
-   `Trim(chars?)` Trim the stirng. This does _not_ ensure the property is a string.
-   `IsNumeric()` Check if the prop is a numeric value
-   `IsString()` Check if the prop is a string
-   `IsLength({ min?, max? })` Check if the object has length

## Utility

-   `IsOptional()` Allow null | undefined
-   `IsOneOf(validators: any[])` Check if any of the validators has passed

## Sanitizers

-   `Trim(chars?: string)`
-   `NormalizeEmail(options: any)`
-   `Blacklist(chars: string)`
-   `Whitelist(chars: string)`

## Creating validators

```ts
import { Validate } from '@rhangai/class-validator';

export const IsPassword = Validate([IsString(), IsLength({ min: 6 })]);
```

You can also use the validator interface to create a validator

```ts
interface Validator {
	/// Test whether this property is valid or not
	test?: (value: any, context: ValidatorContext) => boolean | Promise<boolean>;
	/// Message when there is an error
	message?: string;
	/// If skips returns true, the validation will be skipped
	skip?: (value: any, context: ValidatorContext) => ValidatorSkipResult | Promise<ValidatorSkipResult>;
	/// Transform the property
	transform?: (value: any, context: ValidatorContext) => unknown | Promise<unknown>;
}

const IsPassword = Validate({
	test: input => {
		return typeof input === 'string' && input.length >= 6;
	},
});
```
