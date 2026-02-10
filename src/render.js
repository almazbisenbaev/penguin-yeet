import { VELOCITY_SCALE, SPRING_SQUASH_MS, SPRING_STRETCH_MS, SPRING_RECOVER_MS } from './constants.js';
import { state } from './state.js';
import cannonSpriteUrl from '../assets/images/cannon.png';
import penguinSpriteUrl from '../assets/images/penguin-fly.png';

const cannonImage = new Image();
cannonImage.src = cannonSpriteUrl;
const penguinImage = new Image();
penguinImage.src = penguinSpriteUrl;

/**
 * Renders the entire game scene.
 * Clears the canvas and draws all game objects based on the current state.
 */
export function render() {
  const ctx = state.ctx;
  const width = state.viewportWidth || state.canvas.width;
  const height = state.viewportHeight || state.canvas.height;
  const {
    penguinRadius,
    cannonX,
    cannonWidth,
    cannonHeight,
    powerBarWidth,
    powerBarHeight,
    springHeight,
    springWidths
  } = state.metrics;
  const uiScale = state.uiScale || 1;
  const lineWidth = 3 * uiScale;
  const fontSize = (size) => `${Math.max(12, size * uiScale)}px Arial`;

  ctx.clearRect(0, 0, width, height);
  const skyGradient = ctx.createLinearGradient(0, 0, 0, state.GROUND_Y);
  skyGradient.addColorStop(0, '#87CEEB');
  skyGradient.addColorStop(1, '#E0F6FF');
  ctx.fillStyle = skyGradient;
  ctx.fillRect(0, 0, width, state.GROUND_Y);
  const snowGradient = ctx.createLinearGradient(0, state.GROUND_Y, 0, height);
  snowGradient.addColorStop(0, '#FFFFFF');
  snowGradient.addColorStop(0.5, '#EAF6FF');
  snowGradient.addColorStop(1, '#D6ECFF');
  ctx.fillStyle = snowGradient;
  ctx.fillRect(0, state.GROUND_Y, width, height - state.GROUND_Y);
  ctx.save();
  ctx.translate(-state.cameraX, 0);
  ctx.strokeStyle = '#A3C9FF';
  ctx.lineWidth = lineWidth;
  ctx.beginPath();
  ctx.moveTo(0, state.GROUND_Y);
  ctx.lineTo(state.cameraX + width, state.GROUND_Y);
  ctx.stroke();
  if (state.gameState === 'aiming' || state.gameState === 'power_select' || state.gameState === 'start') {
    ctx.save();
    ctx.translate(cannonX, state.CANNON_Y);
    ctx.rotate(state.cannonAngle);
    if (cannonImage.complete) {
      ctx.drawImage(cannonImage, 0, -cannonHeight / 2, cannonWidth, cannonHeight);
    } else {
      ctx.fillStyle = '#000';
      ctx.fillRect(0, -cannonHeight / 2, cannonWidth, cannonHeight);
    }
    if (state.hasShot) {
      ctx.strokeStyle = 'red';
      ctx.lineWidth = lineWidth;
      ctx.strokeRect(0, -cannonHeight / 2, cannonWidth, cannonHeight);
      if (Date.now() < state.boomUntil) {
        ctx.font = fontSize(28);
        ctx.fillText('💥', cannonWidth + 10 * uiScale, 8 * uiScale);
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
    const springWidth = springWidths[spring.widthIndex ?? 0];
    const h = springHeight * scaleY;
    const yTop = state.GROUND_Y - h;
    ctx.fillStyle = spring.used ? '#999' : '#32CD32';
    ctx.fillRect(spring.x, yTop, springWidth, h);
    ctx.strokeStyle = spring.used ? '#666' : '#228B22';
    ctx.lineWidth = Math.max(1, 2 * uiScale);
    for (let i = 0; i < 5; i++) {
      const y = yTop + (i * h) / 5;
      ctx.beginPath();
      ctx.moveTo(spring.x, y);
      ctx.lineTo(spring.x + springWidth, y);
      ctx.stroke();
    }
    ctx.font = fontSize(20);
    const emojiX = spring.x + springWidth / 2 - 10 * uiScale;
    ctx.fillText('🌀', emojiX, yTop + h / 2 + 6 * uiScale);
  });
  if (state.gameState === 'rolling') {
    ctx.fillStyle = 'red';
    ctx.beginPath();
    ctx.arc(state.penguin.x, state.penguin.y, penguinRadius + 5 * uiScale, 0, Math.PI * 2);
    ctx.fill();
  }

  const speed = Math.hypot(state.penguin.vx, state.penguin.vy);
  const hasSpeed = speed > 0.5;
  const visualDiveMultiplier = 3;
  const renderX = state.penguin.isDiving && hasSpeed
    ? state.penguin.x + state.penguin.vx * (visualDiveMultiplier - 1)
    : state.penguin.x;
  const renderY = state.penguin.isDiving && hasSpeed
    ? state.penguin.y + state.penguin.vy * (visualDiveMultiplier - 1)
    : state.penguin.y;
  if (state.penguin.isDiving && hasSpeed) {
    const dx = state.penguin.vx / speed;
    const dy = state.penguin.vy / speed;
    const length = Math.min(140 * uiScale, 50 * uiScale + speed * 3.2);
    const offset = 10 * uiScale;
    ctx.save();
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.8)';
    ctx.lineWidth = Math.max(1.5, 3 * uiScale);
    for (let i = -2; i <= 2; i++) {
      const px = renderX - dy * offset * i;
      const py = renderY + dx * offset * i;
      ctx.beginPath();
      ctx.moveTo(px - dx * 8 * uiScale, py - dy * 8 * uiScale);
      ctx.lineTo(px - dx * length, py - dy * length);
      ctx.stroke();
    }
    ctx.beginPath();
    ctx.strokeStyle = 'rgba(135, 206, 235, 0.6)';
    ctx.lineWidth = Math.max(1, 2 * uiScale);
    ctx.arc(renderX, renderY, penguinRadius + 10 * uiScale, 0, Math.PI * 2);
    ctx.stroke();
    ctx.restore();
  }

  const drawAngle = state.penguin.isDiving && hasSpeed ? Math.atan2(state.penguin.vy, state.penguin.vx) : 0;
  ctx.save();
  ctx.translate(renderX, renderY);
  if (state.penguin.isDiving && hasSpeed) {
    const maxTilt = Math.PI / 2.4;
    const tilt = Math.max(-maxTilt, Math.min(maxTilt, drawAngle));
    ctx.rotate(tilt);
  }
  const spriteW = penguinRadius * 2.6;
  const spriteH = penguinRadius * 2.2;
  if (penguinImage.complete) {
    ctx.drawImage(penguinImage, -spriteW / 2, -spriteH / 2, spriteW, spriteH);
  } else {
    ctx.fillStyle = '#4169E1';
    ctx.beginPath();
    ctx.arc(0, 0, penguinRadius, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.restore();
  ctx.restore();
  if (state.gameState === 'power_select') {
    const barX = width / 2 - powerBarWidth / 2;
    const barY = Math.max(20 * uiScale, height * 0.08);
    ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
    ctx.fillRect(barX - 10 * uiScale, barY - 10 * uiScale, powerBarWidth + 20 * uiScale, powerBarHeight + 40 * uiScale);
    ctx.fillStyle = 'white';
    ctx.font = fontSize(20);
    ctx.textAlign = 'center';
    ctx.fillText('POWER', width / 2, barY - 20 * uiScale);
    ctx.strokeStyle = 'white';
    ctx.lineWidth = Math.max(1, 2 * uiScale);
    ctx.strokeRect(barX, barY, powerBarWidth, powerBarHeight);
    const fillWidth = (state.powerValue / 100) * powerBarWidth;
    ctx.fillStyle = '#4CAF50';
    ctx.fillRect(barX, barY, fillWidth, powerBarHeight);
    ctx.textAlign = 'left';
  }
  if (state.gameState === 'aiming') {
    ctx.fillStyle = 'white';
    ctx.font = `bold ${Math.max(14, 24 * uiScale)}px Arial`;
    ctx.textAlign = 'center';
    ctx.fillText('Tap/Click or Space to lock angle', width / 2, Math.max(28 * uiScale, height * 0.12));
    ctx.textAlign = 'left';
  }
  if (state.gameState === 'finished') {
    ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
    ctx.fillRect(0, 0, width, height);
    const modalWidth = Math.min(420 * uiScale, width * 0.85);
    const modalHeight = Math.min(260 * uiScale, height * 0.6);
    const modalX = width / 2 - modalWidth / 2;
    const modalY = height / 2 - modalHeight / 2;
    ctx.fillStyle = 'white';
    ctx.fillRect(modalX, modalY, modalWidth, modalHeight);
    ctx.fillStyle = '#333';
    ctx.font = `bold ${Math.max(18, 36 * uiScale)}px Arial`;
    ctx.textAlign = 'center';
    ctx.fillText('Game Over!', width / 2, modalY + 60 * uiScale);
    const distance = Math.max(0, Math.round(state.maxDistance / 10));
    ctx.font = `bold ${Math.max(22, 48 * uiScale)}px Arial`;
    ctx.fillStyle = '#4CAF50';
    ctx.fillText(distance + 'm', width / 2, modalY + 120 * uiScale);
    const buttonWidth = Math.min(220 * uiScale, modalWidth * 0.7);
    const buttonHeight = Math.max(40 * uiScale, modalHeight * 0.2);
    const buttonX = width / 2 - buttonWidth / 2;
    const buttonY = modalY + modalHeight - buttonHeight - 24 * uiScale;
    ctx.fillStyle = '#4CAF50';
    ctx.fillRect(buttonX, buttonY, buttonWidth, buttonHeight);
    ctx.fillStyle = 'white';
    ctx.font = `bold ${Math.max(14, 24 * uiScale)}px Arial`;
    ctx.fillText('Play Again', width / 2, buttonY + buttonHeight * 0.65);
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
