export type Left<T> = {
  left: T;
  right?: never;
};

export type Right<U> = {
  left?: never;
  right: U;
};

export type Either<T, U> = NonNullable<Left<T> | Right<U>>;

export const isLeft = <T, U>(either: Either<T,U>) => !!either.left

export const isRight = <T, U>(either: Either<T,U>) => !!either.right

export const left = <T>(val: T): Left<T> => ({ left: val })

export const right = <U>(val: U): Right<U> => ({ right: val })