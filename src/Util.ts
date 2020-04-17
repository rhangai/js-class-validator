export type Class<T> = { new (...args: any[]): T };
export type Prototype<T> = T & { constructor: Class<T> };

export const VALIDATOR_SYMBOL_DECORATOR = Symbol('validator-decorator');
export const VALIDATOR_SYMBOL_INPUT = Symbol('validator-input-type');

// prettier-ignore
type DeepReadonly<T> = 
	T extends (infer R)[] ? DeepReadonlyArray<R> : 
	T extends Function ? T : 
	T extends Date ? T : 
	T extends {} ? DeepReadonlyObject<T> : 
	T;

interface DeepReadonlyArray<T> extends ReadonlyArray<DeepReadonly<T>> {}
type DeepReadonlyObject<T> = {
	readonly [P in keyof T]: DeepReadonly<T[P]>;
};

export type Validated<T> = DeepReadonlyObject<T>;

interface ValidateInputObjectConversible<InputType> {
	[VALIDATOR_SYMBOL_INPUT]?: InputType;
}

// prettier-ignore
type ValidateInputValue<T> = 
	T extends ValidateInputObjectConversible<infer U> ? U : 
	T extends Array<infer U> ? Array<ValidateInputObject<U>> : 
	T extends Date ? (string | Date) : 
	T extends Object ? ValidateInputObject<T> : 
	T;

// prettier-ignore
type ValidateInputObject<T> = {
	[K in keyof T]?: ValidateInputValue<T[K]> | DeepReadonly<ValidateInputValue<T[K]>>;
};

export type ValidateInput<T> = ValidateInputObject<T>;
