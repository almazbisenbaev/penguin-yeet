/**
 * Physics constants
 */
export const GRAVITY = 0.12;
export const GROUND_Y_RATIO = 0.85;
export const BOUNCE_DAMPING = 0.6;
export const MIN_ENERGY_THRESHOLD = 0.5;
export const PENGUIN_RADIUS = 15;

/**
 * Cannon configuration
 */
export const CANNON_X = 100;
export const CANNON_WIDTH = 60;
export const CANNON_HEIGHT = 30;
export const CANNON_ROTATION_SPEED = 0.02;
export const CANNON_MIN_ANGLE = -Math.PI / 2;
export const CANNON_MAX_ANGLE = 0;

/**
 * Power bar configuration
 */
export const POWER_BAR_WIDTH = 200;
export const POWER_BAR_HEIGHT = 30;
export const POWER_BAR_SPEED = 2;
export const MIN_LAUNCH_SPEED = 10;
export const MAX_LAUNCH_SPEED = 100;

/**
 * Spring (Boost) configuration
 */
export const SPRING_WIDTHS = [30, 60, 90];
export const SPRING_HEIGHT = 40;
export const MIN_SPRING_DISTANCE = 300;
export const MAX_SPRING_DISTANCE = 1200;
export const SPRING_SPAWN_DISTANCE = 1000;
export const SPRING_BOOST = 5;

/**
 * Movement & Mechanics
 */
export const HORIZONTAL_BOOST = 1.03;
export const VELOCITY_SCALE = 0.35;
export const ROLLING_FRICTION = 0.992;
export const ROLLING_SPEED_MULTIPLIER = 2.5;
export const ROLLING_THRESHOLD = 0.2;
export const JUMP_SPEED = 8;
export const JUMP_ANGLE = 60;
export const DIVE_ANGLE = 65;
export const DIVE_BOOST = 1.5;
export const SPRING_SQUASH_MS = 150;
export const SPRING_STRETCH_MS = 180;
export const SPRING_RECOVER_MS = 220;
