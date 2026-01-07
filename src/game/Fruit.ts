import { Vector2D, FruitType } from './Vector2D';

export class Fruit {
  public position: Vector2D;
  public velocity: Vector2D;
  public radius: number = 30;
  public isSliced: boolean = false;
  public sliceAngle: number = 0;
  public gravity: number = 0.15;
  public color: string;
  public type: FruitType;
  public rotation: number = 0;
  public rotationSpeed: number = (Math.random() - 0.5) * 0.1;

  constructor(width: number, height: number) {
    this.type = Math.floor(Math.random() * 4) as FruitType;
    this.position = new Vector2D(Math.random() * width, height + 50);
    
    // Launch fruit upwards
    const targetX = width / 2 + (Math.random() - 0.5) * width * 0.5;
    const launchPower = height * 0.015 + Math.random() * 5;
    const angle = Math.atan2(-launchPower, targetX - this.position.x);
    
    this.velocity = new Vector2D(
      Math.cos(angle) * (5 + Math.random() * 5),
      -launchPower - Math.random() * 5
    );

    this.color = this.getColorByType();
  }

  private getColorByType(): string {
    switch (this.type) {
      case FruitType.APPLE: return '#ff4757';
      case FruitType.ORANGE: return '#ffa502';
      case FruitType.WATERMELON: return '#2ed573';
      case FruitType.BANANA: return '#eccc68';
      default: return '#ffffff';
    }
  }

  update() {
    this.position = this.position.add(this.velocity);
    this.velocity.y += this.gravity;
    this.rotation += this.rotationSpeed;
  }

  draw(ctx: CanvasRenderingContext2D) {
    ctx.save();
    ctx.translate(this.position.x, this.position.y);
    ctx.rotate(this.rotation);

    if (this.isSliced) {
      this.drawSliced(ctx);
    } else {
      this.drawWhole(ctx);
    }

    ctx.restore();
  }

  private drawWhole(ctx: CanvasRenderingContext2D) {
    const gradient = ctx.createRadialGradient(-10, -10, 5, 0, 0, this.radius);
    gradient.addColorStop(0, this.color);
    gradient.addColorStop(1, '#000000');

    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.arc(0, 0, this.radius, 0, Math.PI * 2);
    ctx.fill();

    // Shine
    ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
    ctx.beginPath();
    ctx.arc(-this.radius * 0.3, -this.radius * 0.3, this.radius * 0.2, 0, Math.PI * 2);
    ctx.fill();
  }

  private drawSliced(ctx: CanvasRenderingContext2D) {
    // Basic sliced effect: two halves moving apart
    ctx.fillStyle = this.color;
    
    // Half 1
    ctx.save();
    ctx.translate(-10, 0);
    ctx.beginPath();
    ctx.arc(0, 0, this.radius, Math.PI * 0.5, Math.PI * 1.5);
    ctx.closePath();
    ctx.fill();
    ctx.restore();

    // Half 2
    ctx.save();
    ctx.translate(10, 0);
    ctx.beginPath();
    ctx.arc(0, 0, this.radius, Math.PI * 1.5, Math.PI * 0.5);
    ctx.closePath();
    ctx.fill();
    ctx.restore();
  }

  checkSlice(start: Vector2D, end: Vector2D): boolean {
    if (this.isSliced) return false;

    // Check if line (start, end) intersects circle (this.position, this.radius)
    const d = Vector2D.distance(start, end);
    if (d < 2) return false;

    const distToPoint = this.distToSegment(this.position, start, end);
    if (distToPoint < this.radius) {
      this.isSliced = true;
      return true;
    }
    return false;
  }

  private distToSegment(p: Vector2D, v: Vector2D, w: Vector2D) {
    const l2 = Math.pow(Vector2D.distance(v, w), 2);
    if (l2 === 0) return Vector2D.distance(p, v);
    let t = ((p.x - v.x) * (w.x - v.x) + (p.y - v.y) * (w.y - v.y)) / l2;
    t = Math.max(0, Math.min(1, t));
    return Vector2D.distance(p, new Vector2D(v.x + t * (w.x - v.x), v.y + t * (w.y - v.y)));
  }
}
