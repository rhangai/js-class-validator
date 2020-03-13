# @rhangai/class-validator

## Getting started

```sh
yarn add @rhangai/class-validator
```

Use it

```ts
import { Validate, Trim } from '@rhangai/class-validator';

@Trim()
export class UserDto {
	@Validate()
	name!: string;
	@Validate()
	address!: string;
}
```

Validate your object

```ts
import { validate } from '@rhangai/class-validator';
const obj = {
	name: '   my nam',
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
