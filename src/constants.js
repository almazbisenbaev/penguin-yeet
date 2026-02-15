/**
 * Physics constants
 * These control baseline world dimensions and motion. Values apply every frame in updatePhysics().
 */
// Base design resolution used to compute UI scaling and metric sizes
export const BASE_VIEWPORT_WIDTH = 1200;
export const BASE_VIEWPORT_HEIGHT = 800;
// Gravity applied each frame while flying: vy += GRAVITY
export const GRAVITY = 0.12;
// Ground line as a ratio of canvas height: groundY = height * GROUND_Y_RATIO
export const GROUND_Y_RATIO = 0.85;
// Bounce energy loss on ground hit: vy = -vy * BOUNCE_DAMPING
export const BOUNCE_DAMPING = 0.6;
// Energy threshold to transition from bouncing to rolling (with |vy| < 8)
export const MIN_ENERGY_THRESHOLD = 0.5;
// Penguin collision/render radius (scaled by uiScale at runtime)
export const PENGUIN_RADIUS = 28.6;

/**
 * Cannon configuration
 * Controls aiming behavior and cannon sprite dimensions.
 */
// Cannon base X position
export const CANNON_X = 100;
// Cannon sprite dimensions (scaled by uiScale)
export const CANNON_WIDTH = 60;
export const CANNON_HEIGHT = 30;
// Oscillation speed for auto-aiming in aiming mode (radians/frame)
export const CANNON_ROTATION_SPEED = 0.02;
// Allowed aiming angle range
export const CANNON_MIN_ANGLE = (-65 * Math.PI) / 180;
export const CANNON_MAX_ANGLE = (-10 * Math.PI) / 180;

/**
 * Power bar configuration
 * Controls width/height and oscillation speed of the power selection UI.
 */
export const POWER_BAR_WIDTH = 200;
export const POWER_BAR_HEIGHT = 30;
// How fast the power value moves back and forth (units/frame)
export const POWER_BAR_SPEED = 2;
// Launch speed range used with power percentage, then scaled by VELOCITY_SCALE
export const MIN_LAUNCH_SPEED = 20;
export const MAX_LAUNCH_SPEED = 70;

/**
 * Spring (Boost) configuration
 * Spacing/size of springs and boost behavior when the penguin hits a spring.
 */
// Available spring widths (scaled by uiScale at runtime)
export const SPRING_WIDTHS = [50, 100];
// Spring visual height in pixels (scaled by uiScale at runtime)
export const SPRING_HEIGHT = 60;
// Min/Max spacing for procedural spring placement ahead of the penguin
export const MIN_SPRING_DISTANCE = 300;
export const MAX_SPRING_DISTANCE = 1200;
// How far ahead springs are generated relative to the penguin
export const SPRING_SPAWN_DISTANCE = 1000;

// Low-speed threshold for spring boost
export const SPRING_BOOST = 8;

// Multiplier applied when speed is below SPRING_BOOST
export const SPRING_LOW_SPEED_MULTIPLIER = 1.25;

// Minimum speed after applying a low-speed spring boost
export const SPRING_MIN_SPEED = 3;

// How strongly to correct toward a 45-degree angle on spring hits
export const SPRING_ANGLE_CORRECTION = 0.6;

// Current speed multiplier applied on spring hit (final speed is clamped by cap)
export const SPRING_SPEED_MULTIPLIER = 1.2;

// Maximum allowed speed after spring boost to prevent excessive acceleration
export const SPRING_SPEED_CAP = 30;

/**
 * Movement & Mechanics
 * Global tuning for motion scaling and special actions.
 */
// Small horizontal tuning factor (reserved/unused in current gameplay loop)
export const HORIZONTAL_BOOST = 1.03;
// Maps launch speeds to in-game pixel velocities; also used to convert back to m/s in UI
export const VELOCITY_SCALE = 0.35;
// Rolling friction applied each frame during rolling: vx *= ROLLING_FRICTION
export const ROLLING_FRICTION = 0.992;
// Horizontal boost applied once when entering rolling
export const ROLLING_SPEED_MULTIPLIER = 2.5;
// Speed threshold to exit rolling to finished state
export const ROLLING_THRESHOLD = 0.2;

// One-time jump while rolling: magnitude and angle
export const JUMP_SPEED = 8;
export const JUMP_ANGLE = 60;

// Dive angle and speed multiplier used when setting dive trajectory
export const DIVE_ANGLE = 65;
export const DIVE_BOOST = 1.5;

// Spring hit animation keyframe durations used in render for squash/stretch/recover
export const SPRING_SQUASH_MS = 150;
export const SPRING_STRETCH_MS = 180;
export const SPRING_RECOVER_MS = 220;

// Delay before showing the finish screen after the game ends
export const FINISH_SCREEN_DELAY_MS = 2000;
