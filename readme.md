# Penguin Toss Game

A lightweight browser game built with HTML, CSS, and JavaScript. You launch a penguin from a rotating cannon, choose launch power, bounce across the ground, hit springs to keep flying, and eventually roll to a stop. The UI shows live distance and speed.

## Files at a glance

- **Markup & UI shell:** [index.html](index.html) sets up the canvas and the stat readouts.
- **Styling:** [style.css](style.css) positions the UI and makes the canvas fill the screen.
- **Gameplay & physics:** [script.js](script.js) contains all game logic, drawing, and input handling.

## How to play (gameplay flow)

The game uses a simple state machine: `aiming → power_select → flying → rolling → finished`.

1. **Aiming**
	- The cannon barrel rotates back and forth automatically between $-90^\circ$ (straight up) and $0^\circ$ (horizontal).
	- Press **Space** or **Click** to lock the angle and move to power selection.

2. **Power selection**
	- A power bar oscillates from 0% to 100% and back.
	- Press **Space** or **Click** to launch at the current power.

3. **Flying**
	- The penguin travels under gravity, can bounce on the ground, and can hit springs for extra boosts.
	- While airborne, press **Space** or **Click** to dive downward at a steep angle for a speed boost.
	- The camera scrolls horizontally to keep the penguin roughly in view.

4. **Rolling**
	- When energy is low, the penguin transitions from bouncing to rolling on the ground.
	- While rolling, press **Space** or **Click** once to do a small jump (then you must hit a spring to re‑enable jumping).
	- Rolling slows due to friction and ends when speed drops below a threshold.

5. **Finished**
	- A modal displays the final distance.
	- Click to restart.

## Physics and motion model

All physics are simple 2D kinematics with light arcade tuning. The penguin is represented as a circle with radius **15 px**.

### Gravity & position update

Each frame (via `requestAnimationFrame`):

- Vertical velocity increases by gravity: $v_y \leftarrow v_y + g$ where $g = 0.12$.
- Position updates: $x \leftarrow x + v_x$, $y \leftarrow y + v_y$.

### Launch velocity

Power is mapped to a launch speed range, then scaled for tuning:

1. Raw speed: $s = s_{min} + (p/100) \cdot (s_{max}-s_{min})$ with $s_{min}=10$, $s_{max}=100$.
2. Tuning scale: $s \leftarrow s \cdot 0.35$.
3. Components: $v_x = s\cos(\theta)$, $v_y = s\sin(\theta)$.

### Ground collision & bounce

- The ground is a horizontal line at **85%** of the canvas height.
- When the penguin hits the ground, it bounces:
  - $v_y \leftarrow -v_y \cdot 0.6$ (energy loss)
  - $v_x \leftarrow v_x \cdot 0.95$ (horizontal damping)

### Rolling transition

After each bounce, kinetic energy is checked:

$$
E_k = \tfrac{1}{2} m (v_x^2 + v_y^2)
$$

If $E_k < 0.5$ and $|v_y| < 8$, the penguin switches to **rolling**:

- Vertical velocity is set to 0.
- Horizontal velocity gets a boost: $v_x \leftarrow v_x \cdot 2.5$.

### Rolling friction & stop

While rolling each frame:

- $v_x \leftarrow v_x \cdot 0.992$
- The roll stops when $|v_x| < 0.2$.

### Roll jump

You can jump once during rolling:

- Jump speed: $8$ at $60^\circ$ upward.
- $v_y = -8\sin(60^\circ)$, $v_x \leftarrow v_x + 8\cos(60^\circ)$.
- Jump is disabled until a spring is hit.

### Dive mechanic

While flying and airborne, you can trigger a dive:

- Press **Space** or **Click** while in the air.
- The penguin angles downward at $65^\circ$ from horizontal.
- Current speed is boosted by $1.5\times$.
- Can only dive once per flight (resets on ground or spring hit).
- Useful for hitting springs or quickly returning to rolling.

## Springs (boost pads)

Springs are generated ahead of the penguin with randomized spacing.

- **Spawn distance:** springs are placed up to 1000 px ahead.
- **Spacing:** random between 300 and 1200 px.
- **Widths:** 30, 60, or 90 px.
- **Single‑use:** each spring can only be triggered once.

### Collision zone

- Only the **top 20%** of the spring height is active.
- The active width is extended by **30%** on each side for easier hits.
- The penguin must be moving downward ($v_y \ge 0$).

### Spring boost behavior

When hit, the penguin is re-launched at a fixed $45^\circ$ angle. The boost speed is:

$$
s = \max\left(\sqrt{v_x^2 + v_y^2},\ 5\right)
$$

So springs preserve (or raise) speed and reset the jump ability.

## Distance and speed readouts

- **Distance** is the farthest horizontal distance from the cannon, scaled to meters by dividing pixels by 10.
- **Speed** is displayed in m/s by converting the internal scaled velocity back using the inverse of the tuning scale.

## Run locally

Open [index.html](index.html) in any modern browser and press **Space** or **Click** to play.

## Tuning tips

All gameplay tuning values are near the top of [script.js](script.js). Adjusting these lets you change feel and difficulty:

- `GRAVITY`, `BOUNCE_DAMPING` for jump feel.
- `MIN_LAUNCH_SPEED`, `MAX_LAUNCH_SPEED`, `VELOCITY_SCALE` for launch power.
- `ROLLING_FRICTION`, `ROLLING_THRESHOLD` for roll duration.
- `SPRING_BOOST`, `MIN_SPRING_DISTANCE`, `MAX_SPRING_DISTANCE` for spring behavior.
- `DIVE_ANGLE`, `DIVE_BOOST` for dive mechanics.
