export const FruitType = {
  APPLE: 0,
  ORANGE: 1,
  WATERMELON: 2,
  BANANA: 3
} as const;

export type FruitType = typeof FruitType[keyof typeof FruitType];

export class Vector2D {
  public x: number;
  public y: number;
  constructor(x: number, y: number) {
    this.x = x;
    this.y = y;
  }

  add(v: Vector2D): Vector2D {
    return new Vector2D(this.x + v.x, this.y + v.y);
  }

  sub(v: Vector2D): Vector2D {
    return new Vector2D(this.x - v.x, this.y - v.y);
  }

  multiply(scalar: number): Vector2D {
    return new Vector2D(this.x * scalar, this.y * scalar);
  }

  length(): number {
    return Math.sqrt(this.x * this.x + this.y * this.y);
  }

  normalize(): Vector2D {
    const len = this.length();
    return len === 0 ? new Vector2D(0, 0) : this.multiply(1 / len);
  }

  static distance(v1: Vector2D, v2: Vector2D): number {
    return v1.sub(v2).length();
  }
}
