import { Vector2D } from './Vector2D';

export class Blade {
  public points: { pos: Vector2D; time: number }[] = [];
  public maxAge: number = 200; // ms
  public color: string;

  constructor(color: string = '#ffffff') {
    this.color = color;
  }

  addPoint(pos: Vector2D) {
    this.points.push({ pos, time: Date.now() });
  }

  update() {
    const now = Date.now();
    this.points = this.points.filter(p => now - p.time < this.maxAge);
  }

  draw(ctx: CanvasRenderingContext2D) {
    if (this.points.length < 2) return;

    ctx.save();
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    
    // Draw trail with fading width and opacity
    for (let i = 1; i < this.points.length; i++) {
        const p1 = this.points[i-1];
        const p2 = this.points[i];
        const age = Date.now() - p2.time;
        const lifeRatio = 1 - (age / this.maxAge);
        
        ctx.beginPath();
        ctx.moveTo(p1.pos.x, p1.pos.y);
        ctx.lineTo(p2.pos.x, p2.pos.y);
        
        ctx.strokeStyle = this.color;
        ctx.lineWidth = 10 * lifeRatio * (i / this.points.length);
        ctx.globalAlpha = lifeRatio;
        ctx.stroke();
    }
    
    // Core glow
    ctx.shadowBlur = 10;
    ctx.shadowColor = this.color;
    ctx.globalAlpha = 1;
    ctx.restore();
  }

  getRecentSegment(): [Vector2D, Vector2D] | null {
    if (this.points.length < 2) return null;
    return [this.points[this.points.length - 2].pos, this.points[this.points.length - 1].pos];
  }
}
