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

-   `IsObject()` Check if the property is an object
-   `IsObject(() => Type)` Check if the property is validated against a given type
-   `Trim(chars?)` Trim the stirng. This does _not_ ensure the property is a string.
-   `IsNumeric()` Check if the string is numeric
