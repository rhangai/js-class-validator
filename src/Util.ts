export type Class<T> = { new (...args: any[]): T };
export type Prototype<T> = T & { constructor: Class<T> };

export const SYMBOL_VALIDATOR_DECORATOR = Symbol('validator-decorator');
