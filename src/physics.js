import {
  CANNON_ROTATION_SPEED,
  CANNON_MIN_ANGLE,
  CANNON_MAX_ANGLE,
  POWER_BAR_SPEED
} from './constants.js';
import { state } from './state.js';

/**
 * Generates new springs as the penguin moves forward.
 * Maintains a buffer of springs ahead of the camera.
 */
function generateSprings() {
  const springHeight = state.metrics.springHeight;
  const springWidths = state.metrics.springWidths;
  while (state.lastSpringX < state.penguin.x + state.tuning.SPRING_SPAWN_DISTANCE) {
    const randomDistance =
      state.tuning.MIN_SPRING_DISTANCE +
      state.rng() * (state.tuning.MAX_SPRING_DISTANCE - state.tuning.MIN_SPRING_DISTANCE);
    const springX = state.lastSpringX + randomDistance;
    const springY = state.GROUND_Y - springHeight;
    const widthIndex = Math.floor(state.rng() * springWidths.length);
    state.springs.push({
      x: springX,
      y: springY,
      widthIndex,
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
function nudgeAngleToward(currentAngle, targetAngle, factor) {
  return currentAngle + (targetAngle - currentAngle) * factor;
}

function checkSpringCollisions() {
  for (const spring of state.springs) {
    if (spring.used) continue;
    const springWidth = state.metrics.springWidths[spring.widthIndex ?? 0];
    const activeHeight = state.metrics.springHeight * 0.2;
    const activeTop = spring.y + state.metrics.springHeight * 0.15;
    const activeBottom = activeTop + activeHeight;
    const activeWidthExtension = springWidth * 0.3;
    const activeLeft = spring.x - activeWidthExtension;
    const activeRight = spring.x + springWidth + activeWidthExtension;
    const radius = state.metrics.penguinRadius;
    const penguinLeft = state.penguin.x - radius;
    const penguinRight = state.penguin.x + radius;
    const penguinTop = state.penguin.y - radius;
    const penguinBottom = state.penguin.y + radius;
    if (
      penguinRight > activeLeft &&
      penguinLeft < activeRight &&
      penguinBottom > activeTop &&
      penguinTop < activeBottom &&
      state.penguin.vy >= 0
    ) {
      const base = Math.sqrt(state.penguin.vx * state.penguin.vx + state.penguin.vy * state.penguin.vy);
      let speed = base;
      if (base < state.tuning.SPRING_BOOST) {
        speed = Math.max(
          base * state.tuning.SPRING_LOW_SPEED_MULTIPLIER,
          state.tuning.SPRING_MIN_SPEED
        );
      }
      const targetAngle = Math.PI / 4;
      const currentAngle = Math.atan2(Math.abs(state.penguin.vy), Math.abs(state.penguin.vx));
      const adjustedAngle = nudgeAngleToward(
        currentAngle,
        targetAngle,
        state.tuning.SPRING_ANGLE_CORRECTION
      );
      const directionX = state.penguin.vx >= 0 ? 1 : -1;
      state.penguin.vx = directionX * speed * Math.cos(adjustedAngle);
      state.penguin.vy = -speed * Math.sin(adjustedAngle);
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
    state.penguin.x = state.metrics.cannonX + Math.cos(state.cannonAngle) * state.metrics.cannonWidth;
    state.penguin.y = state.CANNON_Y + Math.sin(state.cannonAngle) * state.metrics.cannonWidth;
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
    state.penguin.y = state.GROUND_Y - state.metrics.penguinRadius;
    if (Math.abs(state.penguin.vx) < state.tuning.ROLLING_THRESHOLD) {
      state.gameState = 'finished';
    }
    const distance = Math.max(0, state.penguin.x - state.metrics.cannonX);
    state.maxDistance = Math.max(state.maxDistance, distance);
    state.cameraX = Math.max(0, state.penguin.x - state.viewportWidth / 3);
    return;
  }
  if (state.gameState !== 'flying') return;
  state.penguin.vy += state.tuning.GRAVITY;
  state.penguin.x += state.penguin.vx;
  state.penguin.y += state.penguin.vy;
  const radius = state.metrics.penguinRadius;
  if (state.penguin.y >= state.GROUND_Y - radius) {
    state.penguin.y = state.GROUND_Y - radius;
    if (state.penguin.isDiving) {
      state.gameState = 'finished';
      state.penguin.vx = 0;
      state.penguin.vy = 0;
      return;
    }
    state.penguin.vy = -state.penguin.vy * state.tuning.BOUNCE_DAMPING;
    state.penguin.vx *= 0.95;
    state.penguin.isDiving = false;
    const kineticEnergy =
      0.5 * state.penguin.mass * (state.penguin.vx * state.penguin.vx + state.penguin.vy * state.penguin.vy);
    if (kineticEnergy < state.tuning.MIN_ENERGY_THRESHOLD && Math.abs(state.penguin.vy) < 8) {
      if (state.canJumpFromRoll) {
        state.gameState = 'rolling';
        state.penguin.vy = 0;
        state.penguin.vx *= state.tuning.ROLLING_SPEED_MULTIPLIER;
      } else {
        state.gameState = 'finished';
        state.penguin.vx = 0;
        state.penguin.vy = 0;
      }
    }
  }
  checkSpringCollisions();
  generateSprings();
  const distance = Math.max(0, state.penguin.x - state.metrics.cannonX);
  state.maxDistance = Math.max(state.maxDistance, distance);
  state.cameraX = Math.max(0, state.penguin.x - state.viewportWidth / 3);
}
