import {
  GRAVITY,
  BOUNCE_DAMPING,
  MIN_ENERGY_THRESHOLD,
  CANNON_X,
  CANNON_ROTATION_SPEED,
  CANNON_MIN_ANGLE,
  CANNON_MAX_ANGLE,
  CANNON_WIDTH,
  POWER_BAR_SPEED,
  PENGUIN_RADIUS,
  SPRING_HEIGHT,
  SPRING_WIDTHS,
  MIN_SPRING_DISTANCE,
  MAX_SPRING_DISTANCE,
  SPRING_SPAWN_DISTANCE,
  SPRING_BOOST,
  ROLLING_FRICTION,
  ROLLING_SPEED_MULTIPLIER,
  ROLLING_THRESHOLD
} from './constants.js';
import { state } from './state.js';

/**
 * Generates new springs as the penguin moves forward.
 * Maintains a buffer of springs ahead of the camera.
 */
function generateSprings() {
  while (state.lastSpringX < state.penguin.x + state.tuning.SPRING_SPAWN_DISTANCE) {
    const randomDistance =
      state.tuning.MIN_SPRING_DISTANCE +
      state.rng() * (state.tuning.MAX_SPRING_DISTANCE - state.tuning.MIN_SPRING_DISTANCE);
    const springX = state.lastSpringX + randomDistance;
    const springY = state.GROUND_Y - SPRING_HEIGHT;
    const springWidth = SPRING_WIDTHS[Math.floor(state.rng() * SPRING_WIDTHS.length)];
    state.springs.push({
      x: springX,
      y: springY,
      width: springWidth,
      used: false,
      animStart: 0
    });
    state.lastSpringX = springX;
  }
  state.springs = state.springs.filter((spring) => spring.x > state.cameraX - 200);
}

/**
 * Checks for collisions between the penguin and springs.
 * Applies a boost if a collision occurs.
 */
function checkSpringCollisions() {
  for (const spring of state.springs) {
    if (spring.used) continue;
    const activeHeight = SPRING_HEIGHT * 0.2;
    const activeTop = spring.y;
    const activeBottom = spring.y + activeHeight;
    const activeWidthExtension = spring.width * 0.3;
    const activeLeft = spring.x - activeWidthExtension;
    const activeRight = spring.x + spring.width + activeWidthExtension;
    const penguinLeft = state.penguin.x - PENGUIN_RADIUS;
    const penguinRight = state.penguin.x + PENGUIN_RADIUS;
    const penguinTop = state.penguin.y - PENGUIN_RADIUS;
    const penguinBottom = state.penguin.y + PENGUIN_RADIUS;
    if (
      penguinRight > activeLeft &&
      penguinLeft < activeRight &&
      penguinBottom > activeTop &&
      penguinTop < activeBottom &&
      state.penguin.vy >= 0
    ) {
      const speed = Math.max(
        Math.sqrt(state.penguin.vx * state.penguin.vx + state.penguin.vy * state.penguin.vy),
        state.tuning.SPRING_BOOST
      );
      const angle = Math.PI / 4;
      state.penguin.vx = speed * Math.cos(angle);
      state.penguin.vy = -speed * Math.sin(angle);
      spring.used = true;
      state.canJumpFromRoll = true;
      state.penguin.isDiving = false;
      spring.animStart = Date.now();
    }
  }
}

/**
 * Updates the physics state of the game.
 * Handles:
 * - Cannon rotation (aiming)
 * - Power bar oscillation
 * - Penguin movement (flying, rolling)
 * - Gravity and friction
 * - Collisions and ground interactions
 */
export function updatePhysics() {
  if (state.gameState === 'aiming') {
    state.cannonAngle += CANNON_ROTATION_SPEED * state.cannonRotationDirection;
    if (state.cannonAngle >= CANNON_MAX_ANGLE) {
      state.cannonAngle = CANNON_MAX_ANGLE;
      state.cannonRotationDirection = -1;
    } else if (state.cannonAngle <= CANNON_MIN_ANGLE) {
      state.cannonAngle = CANNON_MIN_ANGLE;
      state.cannonRotationDirection = 1;
    }
    state.penguin.x = CANNON_X + Math.cos(state.cannonAngle) * CANNON_WIDTH;
    state.penguin.y = state.CANNON_Y + Math.sin(state.cannonAngle) * CANNON_WIDTH;
    return;
  }
  if (state.gameState === 'power_select') {
    state.powerValue += POWER_BAR_SPEED * state.powerDirection;
    if (state.powerValue >= 100) {
      state.powerValue = 100;
      state.powerDirection = -1;
    } else if (state.powerValue <= 0) {
      state.powerValue = 0;
      state.powerDirection = 1;
    }
    return;
  }
  if (state.gameState === 'rolling') {
    state.penguin.vx *= state.tuning.ROLLING_FRICTION;
    state.penguin.x += state.penguin.vx;
    state.penguin.y = state.GROUND_Y - PENGUIN_RADIUS;
    if (Math.abs(state.penguin.vx) < state.tuning.ROLLING_THRESHOLD) {
      state.gameState = 'finished';
    }
    const distance = Math.max(0, state.penguin.x - CANNON_X);
    state.maxDistance = Math.max(state.maxDistance, distance);
    state.cameraX = Math.max(0, state.penguin.x - state.canvas.width / 3);
    return;
  }
  if (state.gameState !== 'flying') return;
  state.penguin.vy += state.tuning.GRAVITY;
  state.penguin.x += state.penguin.vx;
  state.penguin.y += state.penguin.vy;
  if (state.penguin.y >= state.GROUND_Y - PENGUIN_RADIUS) {
    state.penguin.y = state.GROUND_Y - PENGUIN_RADIUS;
    state.penguin.vy = -state.penguin.vy * state.tuning.BOUNCE_DAMPING;
    state.penguin.vx *= 0.95;
    state.penguin.isDiving = false;
    const kineticEnergy =
      0.5 * state.penguin.mass * (state.penguin.vx * state.penguin.vx + state.penguin.vy * state.penguin.vy);
    if (kineticEnergy < state.tuning.MIN_ENERGY_THRESHOLD && Math.abs(state.penguin.vy) < 8) {
      state.gameState = 'rolling';
      state.penguin.vy = 0;
      state.penguin.vx *= state.tuning.ROLLING_SPEED_MULTIPLIER;
    }
  }
  checkSpringCollisions();
  generateSprings();
  const distance = Math.max(0, state.penguin.x - CANNON_X);
  state.maxDistance = Math.max(state.maxDistance, distance);
  state.cameraX = Math.max(0, state.penguin.x - state.canvas.width / 3);
}
