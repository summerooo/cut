import { Fruit } from './Fruit';
import { Vector2D } from './Vector2D';
import { Blade } from './Blade';

export class Game {
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  private fruits: Fruit[] = [];
  private blades: Map<string, Blade> = new Map();
  private p1Score: number = 0;
  private p2Score: number = 0;
  private p3Score: number = 0;
  private p4Score: number = 0;
  private isRunning: boolean = false;
  private lastSpawnTime: number = 0;
  private spawnInterval: number = 1000;

  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d')!;
    this.resize();
    window.addEventListener('resize', () => this.resize());
  }

  private resize() {
    this.canvas.width = window.innerWidth * window.devicePixelRatio;
    this.canvas.height = window.innerHeight * window.devicePixelRatio;
    this.ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
  }

  start() {
    this.isRunning = true;
    this.p1Score = 0;
    this.p2Score = 0;
    this.p3Score = 0;
    this.p4Score = 0;
    this.fruits = [];
    this.updateUI();
    this.loop();
  }

  stop() {
    this.isRunning = false;
  }

  updateInput(id: string, pos: Vector2D, color: string) {
    if (!this.blades.has(id)) {
      this.blades.set(id, new Blade(color));
    }
    const blade = this.blades.get(id)!;
    blade.addPoint(pos);

    const segment = blade.getRecentSegment();
    if (segment) {
      this.checkSlices(segment[0], segment[1], id);
    }
  }

  private checkSlices(start: Vector2D, end: Vector2D, playerId: string) {
    this.fruits.forEach(fruit => {
      if (fruit.checkSlice(start, end)) {
        if (playerId.includes('hand-0') || playerId.includes('touch-0')) {
          this.p1Score += 10;
        } else if (playerId.includes('hand-1') || playerId.includes('touch-1')) {
          this.p2Score += 10;
        } else if (playerId.includes('hand-2') || playerId.includes('touch-2')) {
          this.p3Score += 10;
        } else if (playerId.includes('hand-3') || playerId.includes('touch-3')) {
          this.p4Score += 10;
        } else {
          // Default to p1 if ID doesn't match specific players
          this.p1Score += 10;
        }
        this.updateUI();
      }
    });
  }

  private spawnFruit() {
    const now = Date.now();
    if (now - this.lastSpawnTime > this.spawnInterval) {
      const count = Math.floor(Math.random() * 3) + 1;
      for (let i = 0; i < count; i++) {
        this.fruits.push(new Fruit(window.innerWidth, window.innerHeight));
      }
      this.lastSpawnTime = now;
      this.spawnInterval = Math.max(500, 1000 - (this.p1Score + this.p2Score) * 2);
    }
  }

  private loop() {
    if (!this.isRunning) return;

    this.ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);

    this.spawnFruit();

    // Update and draw blades
    this.blades.forEach(blade => {
      blade.update();
      blade.draw(this.ctx);
    });

    // Update and draw fruits
    this.fruits = this.fruits.filter(fruit => {
      fruit.update();
      fruit.draw(this.ctx);
      return fruit.position.y < window.innerHeight + 100;
    });

    requestAnimationFrame(() => this.loop());
  }

  private updateUI() {
    document.getElementById('p1-score')!.innerText = this.p1Score.toString();
    document.getElementById('p2-score')!.innerText = this.p2Score.toString();
    document.getElementById('p3-score')!.innerText = this.p3Score.toString();
    document.getElementById('p4-score')!.innerText = this.p4Score.toString();
  }
}
