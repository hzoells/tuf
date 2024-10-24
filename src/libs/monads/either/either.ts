export interface EitherType<L, R> {
  isLeft(): this is Left<L, R>
  isRight(): this is Right<L, R>
}

export class Left<L, R> implements EitherType<L, R> {
  public readonly left: L;

  constructor(value: L) {
    this.left = value;
  }

  isLeft(): this is Left<L, R> {
    return true;
  }
  
  isRight(): this is Right<L, R> {
    return false;
  }
}

export class Right<L, R> implements EitherType<L, R> {
  public readonly right: R;

  constructor(value: R) {
    this.right = value;
  }

  isLeft(): this is Left<L, R> {
    return false;
  }
  
  isRight(): this is Right<L, R> {
    return true;
  }
}

export function right<L,R>(value:R): Right<L,R> {
  return new Right(value)
}

export function left<L,R>(value:L): Left<L,R> {
  return new Left(value)
}

export type Either<L,R> = Left<L, R> | Right<L, R>