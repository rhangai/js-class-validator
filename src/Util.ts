export type Class<T> = { new (...args: any[]): T };
export type Prototype<T> = T & { constructor: Class<T> };

export const SYMBOL_VALIDATOR_DECORATOR = Symbol('validator-decorator');

type DeepReadonly<T> = T extends (infer R)[]
	? DeepReadonlyArray<R>
	: T extends Function
	? T
	: T extends {}
	? DeepReadonlyObject<T>
	: T;

interface DeepReadonlyArray<T> extends ReadonlyArray<DeepReadonly<T>> {}

type DeepReadonlyObject<T> = {
	readonly [P in keyof T]: DeepReadonly<T[P]>;
};

export type Validated<T> = DeepReadonlyObject<T>;
