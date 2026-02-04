import {
  CANNON_WIDTH,
  CANNON_HEIGHT,
  POWER_BAR_WIDTH,
  POWER_BAR_HEIGHT,
  MIN_LAUNCH_SPEED,
  MAX_LAUNCH_SPEED,
  VELOCITY_SCALE,
  JUMP_SPEED,
  JUMP_ANGLE,
  DIVE_ANGLE,
  DIVE_BOOST,
  GROUND_Y_RATIO,
  PENGUIN_RADIUS,
  SPRING_HEIGHT,
  SPRING_WIDTHS,
  MIN_SPRING_DISTANCE,
  MAX_SPRING_DISTANCE,
  SPRING_SPAWN_DISTANCE,
  BASE_VIEWPORT_WIDTH,
  BASE_VIEWPORT_HEIGHT
} from './constants.js';
import { state } from './state.js';
import seedrandom from 'seedrandom';

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

/**
 * Initializes the game.
 * Sets up the canvas, event listeners, and the random number generator.
 */
export function init() {
  state.canvas = document.getElementById('gameCanvas');
  state.ctx = state.canvas.getContext('2d');
  updateCanvasSize();
  window.addEventListener('resize', updateCanvasSize);
  state.canvas.addEventListener('pointerdown', (event) => {
    event.preventDefault();
    handleInput();
  });
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
    const startGame = () => {
      if (state.gameState !== 'start') return;
      document.getElementById('start-screen').style.display = 'none';
      document.querySelector('.stats').style.display = 'flex';
      state.gameState = 'aiming';
    };
    playBtn.addEventListener('pointerdown', (event) => {
      event.preventDefault();
      startGame();
    });
    playBtn.addEventListener('click', (event) => {
      event.preventDefault();
      startGame();
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
    state.penguin.y < state.GROUND_Y - state.metrics.penguinRadius - 5
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
  const container = document.querySelector('.container');
  const width = Math.max(1, container?.clientWidth || window.innerWidth);
  const height = Math.max(1, container?.clientHeight || window.innerHeight);
  const dpr = Math.min(window.devicePixelRatio || 1, 2);

  state.viewportWidth = width;
  state.viewportHeight = height;
  state.dpr = dpr;
  state.canvas.style.width = `${width}px`;
  state.canvas.style.height = `${height}px`;
  state.canvas.width = Math.round(width * dpr);
  state.canvas.height = Math.round(height * dpr);
  state.ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

  const baseScale = Math.min(width / BASE_VIEWPORT_WIDTH, height / BASE_VIEWPORT_HEIGHT);
  state.uiScale = clamp(baseScale, 0.6, 1.25);
  const cannonX = Math.max(60 * state.uiScale, width * 0.09);

  state.metrics = {
    penguinRadius: PENGUIN_RADIUS * state.uiScale,
    cannonX,
    cannonWidth: CANNON_WIDTH * state.uiScale,
    cannonHeight: CANNON_HEIGHT * state.uiScale,
    powerBarWidth: POWER_BAR_WIDTH * state.uiScale,
    powerBarHeight: POWER_BAR_HEIGHT * state.uiScale,
    springHeight: SPRING_HEIGHT * state.uiScale,
    springWidths: SPRING_WIDTHS.map((size) => size * state.uiScale)
  };

  const widthScale = clamp(width / BASE_VIEWPORT_WIDTH, 0.7, 1.4);
  state.tuning.MIN_SPRING_DISTANCE = MIN_SPRING_DISTANCE * widthScale;
  state.tuning.MAX_SPRING_DISTANCE = MAX_SPRING_DISTANCE * widthScale;
  state.tuning.SPRING_SPAWN_DISTANCE = SPRING_SPAWN_DISTANCE * widthScale;

  state.GROUND_Y = height * GROUND_Y_RATIO;
  state.CANNON_Y = state.GROUND_Y;
  const radius = state.metrics.penguinRadius;
  if (state.gameState === 'aiming' || state.gameState === 'power_select' || state.gameState === 'start') {
    state.penguin.x = cannonX + Math.cos(state.cannonAngle) * state.metrics.cannonWidth;
    state.penguin.y = state.CANNON_Y + Math.sin(state.cannonAngle) * state.metrics.cannonWidth;
  } else {
    state.penguin.y = Math.min(state.penguin.y, state.GROUND_Y - radius);
  }

  state.springs.forEach((spring) => {
    if (spring.widthIndex === undefined) spring.widthIndex = 0;
    spring.y = state.GROUND_Y - state.metrics.springHeight;
  });
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
  state.lastSpringX = state.metrics.cannonX;
  state.maxDistance = 0;
  state.canJumpFromRoll = true;
}

/**
 * Resets the game to the initial aiming state.
 * Resets penguin position, velocity, and game variables.
 */
export function reset() {
  state.penguin.x = state.metrics.cannonX;
  state.penguin.y = state.CANNON_Y - state.metrics.penguinRadius;
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
