export type Class<T> = { new (...args: any[]): T };
export type Prototype<T> = T & { constructor: Class<T> };

export const SYMBOL_VALIDATOR_DECORATOR = Symbol('validator-decorator');
export const SYMBOL_VALIDATOR_INPUT_TYPE = Symbol('validator-input-type');

// prettier-ignore
type DeepReadonly<T> = 
	T extends (infer R)[] ? DeepReadonlyArray<R> : 
	T extends Function ? T : 
	T extends {} ? DeepReadonlyObject<T> : 
	T;
interface DeepReadonlyArray<T> extends ReadonlyArray<DeepReadonly<T>> {}
type DeepReadonlyObject<T> = {
	readonly [P in keyof T]: DeepReadonly<T[P]>;
};

export type Validated<T> = DeepReadonlyObject<T>;

interface ValidateInputObjectConversible<InputType> {
	[SYMBOL_VALIDATOR_INPUT_TYPE]: InputType;
}

// prettier-ignore
type UnvalidatedField<T> = 
	T extends ValidateInputObjectConversible<infer U> ? U : 
	T extends Array<infer U> ? Array<ValidateInputObject<U>> : 
	T extends Object ? ValidateInputObject<T> : 
	T;

// prettier-ignore
type ValidateInputObject<T> = {
	[K in keyof T]?: UnvalidatedField<T[K]>;
};

export type ValidateInput<T> = ValidateInputObject<T>;
