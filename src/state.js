import {
  PENGUIN_RADIUS,
  CANNON_X,
  CANNON_WIDTH,
  CANNON_HEIGHT,
  POWER_BAR_WIDTH,
  POWER_BAR_HEIGHT,
  SPRING_HEIGHT,
  SPRING_WIDTHS,
  GRAVITY,
  BOUNCE_DAMPING,
  MIN_ENERGY_THRESHOLD,
  ROLLING_FRICTION,
  ROLLING_SPEED_MULTIPLIER,
  ROLLING_THRESHOLD,
  SPRING_BOOST,
  SPRING_LOW_SPEED_MULTIPLIER,
  SPRING_MIN_SPEED,
  SPRING_ANGLE_CORRECTION,
  MIN_SPRING_DISTANCE,
  MAX_SPRING_DISTANCE,
  SPRING_SPAWN_DISTANCE,
  SPRING_SPEED_MULTIPLIER,
  SPRING_SPEED_CAP
} from './constants.js';

/**
 * Global game state object.
 * Stores all mutable data for the game instance.
 */
export const state = {
  // Canvas and Context
  canvas: null,
  ctx: null,
  viewportWidth: 0,
  viewportHeight: 0,
  dpr: 1,
  uiScale: 1,
  metrics: {
    penguinRadius: PENGUIN_RADIUS,
    cannonX: CANNON_X,
    cannonWidth: CANNON_WIDTH,
    cannonHeight: CANNON_HEIGHT,
    powerBarWidth: POWER_BAR_WIDTH,
    powerBarHeight: POWER_BAR_HEIGHT,
    springHeight: SPRING_HEIGHT,
    springWidths: [...SPRING_WIDTHS]
  },

  // Game Flow
  gameState: 'start', // 'start', 'aiming', 'power_select', 'flying', 'rolling', 'finished'
  
  // Physics Objects
  penguin: {
    x: CANNON_X,
    y: 400 - PENGUIN_RADIUS,
    vx: 0,
    vy: 0,
    mass: 1,
    isDiving: false
  },
  springs: [],
  
  // Camera & World
  cameraX: 0,
  lastSpringX: 0,
  maxDistance: 0,
  GROUND_Y: 400,
  
  // Gameplay Variables
  canJumpFromRoll: true,
  cannonAngle: -Math.PI / 4,
  cannonRotationDirection: 1,
  powerValue: 50,
  powerDirection: 1,
  CANNON_Y: 400,
  
  // Utilities
  rng: Math.random,
  hasShot: false,
  boomUntil: 0,
  lastJumpAt: 0,
  
  // Physics Tuning Parameters
  tuning: {
    GRAVITY,
    BOUNCE_DAMPING,
    MIN_ENERGY_THRESHOLD,
    ROLLING_FRICTION,
    ROLLING_SPEED_MULTIPLIER,
    ROLLING_THRESHOLD,
    SPRING_BOOST,
    SPRING_LOW_SPEED_MULTIPLIER,
    SPRING_MIN_SPEED,
    SPRING_ANGLE_CORRECTION,
    MIN_SPRING_DISTANCE,
    MAX_SPRING_DISTANCE,
    SPRING_SPAWN_DISTANCE,
    SPRING_SPEED_MULTIPLIER,
    SPRING_SPEED_CAP
  }
};
