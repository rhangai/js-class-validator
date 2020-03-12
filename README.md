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

-   IsObject(\_ => )
