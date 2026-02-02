import {
  CANNON_X,
  CANNON_WIDTH,
  CANNON_HEIGHT,
  CANNON_ROTATION_SPEED,
  CANNON_MIN_ANGLE,
  CANNON_MAX_ANGLE,
  POWER_BAR_SPEED,
  MIN_LAUNCH_SPEED,
  MAX_LAUNCH_SPEED,
  VELOCITY_SCALE,
  JUMP_SPEED,
  JUMP_ANGLE,
  DIVE_ANGLE,
  DIVE_BOOST,
  GROUND_Y_RATIO,
  PENGUIN_RADIUS
} from './constants.js';
import { state } from './state.js';
import seedrandom from 'seedrandom';

/**
 * Initializes the game.
 * Sets up the canvas, event listeners, and the random number generator.
 */
export function init() {
  state.canvas = document.getElementById('gameCanvas');
  state.ctx = state.canvas.getContext('2d');
  updateCanvasSize();
  window.addEventListener('resize', updateCanvasSize);
  state.canvas.addEventListener('click', handleInput);
  window.addEventListener('keydown', (e) => {
    if (e.code === 'Space') {
      e.preventDefault();
      handleInput();
    }
  });

  const seedObj = { seed: '' };
  // Setup RNG with default random or seeded random if needed
  state.rng = Math.random;

  const playBtn = document.getElementById('play-btn');
  if (playBtn) {
    playBtn.addEventListener('click', () => {
      document.getElementById('start-screen').style.display = 'none';
      document.querySelector('.stats').style.display = 'flex';
      state.gameState = 'aiming';
    });
  }
}

/**
 * Handles user input based on the current game state.
 * - 'start': No action (handled by Play button)
 * - 'aiming': Locks angle and moves to power selection
 * - 'power_select': Launches the penguin
 * - 'flying': Triggers a dive if conditions are met
 * - 'rolling': Triggers a jump if allowed
 * - 'finished': Resets the game
 */
export function handleInput() {
  if (state.gameState === 'start') return;
  if (state.gameState === 'aiming') {
    state.gameState = 'power_select';
  } else if (state.gameState === 'power_select') {
    launchPenguin();
  } else if (
    state.gameState === 'flying' &&
    !state.penguin.isDiving &&
    state.penguin.y < state.GROUND_Y - PENGUIN_RADIUS - 5
  ) {
    state.penguin.isDiving = true;
    const currentSpeed = Math.sqrt(state.penguin.vx * state.penguin.vx + state.penguin.vy * state.penguin.vy);
    const boostedSpeed = currentSpeed * DIVE_BOOST;
    const angleRad = (DIVE_ANGLE * Math.PI) / 180;
    state.penguin.vx = boostedSpeed * Math.cos(angleRad);
    state.penguin.vy = boostedSpeed * Math.sin(angleRad);
  } else if (state.gameState === 'rolling' && state.canJumpFromRoll) {
    const angleRad = (JUMP_ANGLE * Math.PI) / 180;
    state.penguin.vy = -JUMP_SPEED * Math.sin(angleRad);
    state.penguin.vx += JUMP_SPEED * Math.cos(angleRad);
    state.gameState = 'flying';
    state.canJumpFromRoll = false;
  } else if (state.gameState === 'finished') {
    reset();
  }
}

/**
 * Updates the canvas size to match the window dimensions.
 * Also updates ground level and cannon position relative to the new size.
 */
export function updateCanvasSize() {
  state.canvas.width = window.innerWidth;
  state.canvas.height = window.innerHeight;
  state.GROUND_Y = state.canvas.height * GROUND_Y_RATIO;
  state.CANNON_Y = state.GROUND_Y;
  if (state.gameState === 'aiming') {
    state.penguin.x = CANNON_X + Math.cos(state.cannonAngle) * CANNON_WIDTH;
    state.penguin.y = state.CANNON_Y + Math.sin(state.cannonAngle) * CANNON_WIDTH;
  }
}

/**
 * Handles jump input specifically during the rolling state.
 * Allows the penguin to jump once while rolling.
 */
export function handleJumpInput() {
  if (state.gameState === 'rolling' && state.canJumpFromRoll) {
    const angleRad = (JUMP_ANGLE * Math.PI) / 180;
    state.penguin.vy = -JUMP_SPEED * Math.sin(angleRad);
    state.penguin.vx += JUMP_SPEED * Math.cos(angleRad);
    state.gameState = 'flying';
    state.canJumpFromRoll = false;
  }
}

/**
 * Launches the penguin from the cannon.
 * Calculates initial velocity based on power and angle.
 * Sets the game state to 'flying'.
 */
export function launchPenguin() {
  const speed =
    (MIN_LAUNCH_SPEED + (state.powerValue / 100) * (MAX_LAUNCH_SPEED - MIN_LAUNCH_SPEED)) * VELOCITY_SCALE;
  state.penguin.vx = speed * Math.cos(state.cannonAngle);
  state.penguin.vy = speed * Math.sin(state.cannonAngle);
  state.gameState = 'flying';
  state.hasShot = true;
  state.boomUntil = Date.now() + 700;
  state.springs = [];
  state.lastSpringX = CANNON_X;
  state.maxDistance = 0;
  state.canJumpFromRoll = true;
}

/**
 * Resets the game to the initial aiming state.
 * Resets penguin position, velocity, and game variables.
 */
export function reset() {
  state.penguin.x = CANNON_X;
  state.penguin.y = state.CANNON_Y - PENGUIN_RADIUS;
  state.penguin.vx = 0;
  state.penguin.vy = 0;
  state.penguin.isDiving = false;
  state.springs = [];
  state.cameraX = 0;
  state.lastSpringX = 0;
  state.maxDistance = 0;
  state.gameState = 'aiming';
  state.canJumpFromRoll = true;
  state.cannonAngle = -Math.PI / 4;
  state.cannonRotationDirection = 1;
  state.powerValue = 50;
  state.powerDirection = 1;
  state.hasShot = false;
  state.boomUntil = 0;
}
