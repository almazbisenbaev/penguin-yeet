import { init } from './actions.js';
import { updatePhysics } from './physics.js';
import { render } from './render.js';

/**
 * Main game loop.
 * Updates physics and renders the scene on every frame.
 */
function gameLoop() {
  updatePhysics();
  render();
  requestAnimationFrame(gameLoop);
}

// Initialize the game when the window loads
window.addEventListener('load', () => {
  init();
  requestAnimationFrame(gameLoop);
});
