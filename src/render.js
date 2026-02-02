import {
  POWER_BAR_WIDTH,
  POWER_BAR_HEIGHT,
  SPRING_HEIGHT,
  PENGUIN_RADIUS,
  CANNON_X,
  CANNON_HEIGHT,
  CANNON_WIDTH,
  VELOCITY_SCALE,
  SPRING_SQUASH_MS,
  SPRING_STRETCH_MS,
  SPRING_RECOVER_MS
} from './constants.js';
import { state } from './state.js';
import cannonSpriteUrl from '../assets/images/cannon.png';

const cannonImage = new Image();
cannonImage.src = cannonSpriteUrl;

/**
 * Renders the entire game scene.
 * Clears the canvas and draws all game objects based on the current state.
 */
export function render() {
  const ctx = state.ctx;
  ctx.clearRect(0, 0, state.canvas.width, state.canvas.height);
  const skyGradient = ctx.createLinearGradient(0, 0, 0, state.GROUND_Y);
  skyGradient.addColorStop(0, '#87CEEB');
  skyGradient.addColorStop(1, '#E0F6FF');
  ctx.fillStyle = skyGradient;
  ctx.fillRect(0, 0, state.canvas.width, state.GROUND_Y);
  ctx.fillStyle = '#8B7355';
  ctx.fillRect(0, state.GROUND_Y, state.canvas.width, state.canvas.height - state.GROUND_Y);
  ctx.save();
  ctx.translate(-state.cameraX, 0);
  ctx.strokeStyle = '#654321';
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(0, state.GROUND_Y);
  ctx.lineTo(state.cameraX + state.canvas.width, state.GROUND_Y);
  ctx.stroke();
  if (state.gameState === 'aiming' || state.gameState === 'power_select' || state.gameState === 'start') {
    ctx.save();
    ctx.translate(CANNON_X, state.CANNON_Y);
    ctx.rotate(state.cannonAngle);
    if (cannonImage.complete) {
      ctx.drawImage(cannonImage, 0, -CANNON_HEIGHT / 2, CANNON_WIDTH, CANNON_HEIGHT);
    } else {
      ctx.fillStyle = '#000';
      ctx.fillRect(0, -CANNON_HEIGHT / 2, CANNON_WIDTH, CANNON_HEIGHT);
    }
    if (state.hasShot) {
      ctx.strokeStyle = 'red';
      ctx.lineWidth = 3;
      ctx.strokeRect(0, -CANNON_HEIGHT / 2, CANNON_WIDTH, CANNON_HEIGHT);
      if (Date.now() < state.boomUntil) {
        ctx.font = '28px Arial';
        ctx.fillText('💥', CANNON_WIDTH + 10, 8);
      }
    }
    ctx.restore();
  }
  state.springs.forEach((spring) => {
    const now = Date.now();
    const start = spring.animStart || 0;
    const t = Math.max(0, now - start);
    const t1 = SPRING_SQUASH_MS;
    const t2 = t1 + SPRING_STRETCH_MS;
    const t3 = t2 + SPRING_RECOVER_MS;
    let scaleY = 1;
    if (t > 0 && t <= t1) {
      const p = t / t1;
      scaleY = 1 + (0.8 - 1) * p;
    } else if (t > t1 && t <= t2) {
      const p = (t - t1) / (t2 - t1);
      scaleY = 0.8 + (1.2 - 0.8) * p;
    } else if (t > t2 && t <= t3) {
      const p = (t - t2) / (t3 - t2);
      scaleY = 1.2 + (1 - 1.2) * p;
    } else {
      scaleY = 1;
    }
    const h = SPRING_HEIGHT * scaleY;
    const yTop = state.GROUND_Y - h;
    ctx.fillStyle = spring.used ? '#999' : '#32CD32';
    ctx.fillRect(spring.x, yTop, spring.width, h);
    ctx.strokeStyle = spring.used ? '#666' : '#228B22';
    ctx.lineWidth = 2;
    for (let i = 0; i < 5; i++) {
      const y = yTop + (i * h) / 5;
      ctx.beginPath();
      ctx.moveTo(spring.x, y);
      ctx.lineTo(spring.x + spring.width, y);
      ctx.stroke();
    }
    ctx.font = '20px Arial';
    const emojiX = spring.x + spring.width / 2 - 10;
    ctx.fillText('🌀', emojiX, yTop + h / 2);
  });
  if (state.gameState === 'rolling') {
    ctx.fillStyle = 'red';
    ctx.beginPath();
    ctx.arc(state.penguin.x, state.penguin.y, PENGUIN_RADIUS + 5, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.fillStyle = '#4169E1';
  ctx.beginPath();
  ctx.arc(state.penguin.x, state.penguin.y, PENGUIN_RADIUS, 0, Math.PI * 2);
  ctx.fill();
  ctx.font = '25px Arial';
  ctx.fillText('🐧', state.penguin.x - 12, state.penguin.y + 8);
  ctx.restore();
  if (state.gameState === 'power_select') {
    const barX = state.canvas.width / 2 - POWER_BAR_WIDTH / 2;
    const barY = 100;
    ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
    ctx.fillRect(barX - 10, barY - 10, POWER_BAR_WIDTH + 20, POWER_BAR_HEIGHT + 40);
    ctx.fillStyle = 'white';
    ctx.font = '20px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('POWER', state.canvas.width / 2, barY - 20);
    ctx.strokeStyle = 'white';
    ctx.lineWidth = 2;
    ctx.strokeRect(barX, barY, POWER_BAR_WIDTH, POWER_BAR_HEIGHT);
    const fillWidth = (state.powerValue / 100) * POWER_BAR_WIDTH;
    ctx.fillStyle = '#4CAF50';
    ctx.fillRect(barX, barY, fillWidth, POWER_BAR_HEIGHT);
    ctx.textAlign = 'left';
  }
  if (state.gameState === 'aiming') {
    ctx.fillStyle = 'white';
    ctx.font = 'bold 24px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('Press SPACE or CLICK to lock angle', state.canvas.width / 2, 100);
    ctx.textAlign = 'left';
  }
  if (state.gameState === 'finished') {
    ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
    ctx.fillRect(0, 0, state.canvas.width, state.canvas.height);
    const modalWidth = 400;
    const modalHeight = 250;
    const modalX = state.canvas.width / 2 - modalWidth / 2;
    const modalY = state.canvas.height / 2 - modalHeight / 2;
    ctx.fillStyle = 'white';
    ctx.fillRect(modalX, modalY, modalWidth, modalHeight);
    ctx.fillStyle = '#333';
    ctx.font = 'bold 36px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('Game Over!', state.canvas.width / 2, modalY + 60);
    const distance = Math.max(0, Math.round(state.maxDistance / 10));
    ctx.font = 'bold 48px Arial';
    ctx.fillStyle = '#4CAF50';
    ctx.fillText(distance + 'm', state.canvas.width / 2, modalY + 120);
    const buttonWidth = 200;
    const buttonHeight = 50;
    const buttonX = state.canvas.width / 2 - buttonWidth / 2;
    const buttonY = modalY + modalHeight - 80;
    ctx.fillStyle = '#4CAF50';
    ctx.fillRect(buttonX, buttonY, buttonWidth, buttonHeight);
    ctx.fillStyle = 'white';
    ctx.font = 'bold 24px Arial';
    ctx.fillText('Play Again', state.canvas.width / 2, buttonY + 33);
    ctx.textAlign = 'left';
  }
  updateStats();
}

/**
 * Updates the HTML elements for distance and speed stats.
 */
export function updateStats() {
  const distance = Math.max(0, Math.round(state.maxDistance / 10));
  const actualSpeed =
    Math.sqrt(state.penguin.vx * state.penguin.vx + state.penguin.vy * state.penguin.vy) / VELOCITY_SCALE;
  const speed = actualSpeed.toFixed(1);
  const distanceEl = document.getElementById('distance');
  const speedEl = document.getElementById('speed-display');
  if (distanceEl) distanceEl.textContent = String(distance);
  if (speedEl) speedEl.textContent = state.gameState === 'flying' || state.gameState === 'rolling' ? String(speed) : '0';
}
