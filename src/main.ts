import './style.css';
import { Game } from './game/Game';
import { Vector2D } from './game/Vector2D';
import { Hands, type Results } from '@mediapipe/hands';
import { Camera } from '@mediapipe/camera_utils';

const videoElement = document.getElementsByClassName('input_video')[0] as HTMLVideoElement;
const canvasElement = document.getElementsByClassName('output_canvas')[0] as HTMLCanvasElement;
const gameStatus = document.getElementById('game-status')!;

const game = new Game(canvasElement);

// MediaPipe Setup
const hands = new Hands({
  locateFile: (file) => {
    return `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${file}`;
  }
});

hands.setOptions({
  maxNumHands: 4,
  modelComplexity: 1,
  minDetectionConfidence: 0.5,
  minTrackingConfidence: 0.5
});

const PLAYER_COLORS = ['#ff4757', '#2e86de', '#2ed573', '#ffa502'];

hands.onResults((results: Results) => {
  if (results.multiHandLandmarks) {
    for (let i = 0; i < results.multiHandLandmarks.length; i++) {
      const landmarks = results.multiHandLandmarks[i];
      const fingerTip = landmarks[8];
      
      const x = (1 - fingerTip.x) * window.innerWidth;
      const y = fingerTip.y * window.innerHeight;
      
      const handId = `hand-${i}`;
      const color = PLAYER_COLORS[i % PLAYER_COLORS.length];
      game.updateInput(handId, new Vector2D(x, y), color);
    }
  }
});

const camera = new Camera(videoElement, {
  onFrame: async () => {
    await hands.send({ image: videoElement });
  },
  width: 1280,
  height: 720
});

// Touch Events
canvasElement.addEventListener('pointermove', (e) => {
  if (e.pointerType === 'touch' || e.pointerType === 'mouse') {
    game.updateInput(`touch-${e.pointerId}`, new Vector2D(e.clientX, e.clientY), '#ffffff');
  }
});

// Start Game
gameStatus.addEventListener('click', () => {
  gameStatus.style.display = 'none';
  game.start();
  camera.start();
});
