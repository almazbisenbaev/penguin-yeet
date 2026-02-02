// Game constants
const GRAVITY = 0.12; // Further reduced for slower gameplay
const GROUND_Y_RATIO = 0.85; // Ground at 85% of canvas height
let GROUND_Y = 400; // Will be updated based on canvas height
const BOUNCE_DAMPING = 0.6; // Energy loss on bounce
const MIN_ENERGY_THRESHOLD = 0.5; // Much higher to trigger rolling while still bouncing (was 0.15)
const PENGUIN_RADIUS = 15;
const CANNON_X = 100;
let CANNON_Y = 400; // Will be updated based on GROUND_Y
const CANNON_WIDTH = 60;
const CANNON_HEIGHT = 15;
const CANNON_ROTATION_SPEED = 0.02; // Radians per frame
const CANNON_MIN_ANGLE = -Math.PI / 2; // -90 degrees (straight up)
const CANNON_MAX_ANGLE = 0; // 0 degrees (horizontal right)
const POWER_BAR_WIDTH = 200;
const POWER_BAR_HEIGHT = 30;
const POWER_BAR_SPEED = 2; // Speed of power bar oscillation
const MIN_LAUNCH_SPEED = 10;
const MAX_LAUNCH_SPEED = 100;
const SPRING_WIDTHS = [30, 60, 90]; // Three width options: narrow, medium, wide (50% wider)
const SPRING_HEIGHT = 40;
const MIN_SPRING_DISTANCE = 300; // Minimum distance between springs (reduced for more variation)
const MAX_SPRING_DISTANCE = 1200; // Maximum distance between springs (for randomness)
const SPRING_SPAWN_DISTANCE = 1000; // Distance ahead to spawn springs
const SPRING_BOOST = 5; // Further reduced from 6
const HORIZONTAL_BOOST = 1.03; // Further reduced from 1.05
const VELOCITY_SCALE = 0.35; // Further reduced for slower movement
const ROLLING_FRICTION = 0.992; // Increased friction for shorter duration (was 0.999)
const ROLLING_SPEED_MULTIPLIER = 2.5; // Multiply horizontal velocity when entering roll state for more distance
const ROLLING_THRESHOLD = 0.2; // Speed threshold to stop rolling
const JUMP_SPEED = 8; // Jump speed when exiting roll state (increased from 4 for more distance)
const JUMP_ANGLE = 60; // Jump angle in degrees
const DIVE_ANGLE = 65; // Dive angle in degrees (downward from horizontal)
const DIVE_BOOST = 1.5; // Speed multiplier when diving

// Game state
let canvas, ctx;
let gameState = 'aiming'; // aiming, power_select, flying, rolling, finished
let penguin = {
    x: CANNON_X,
    y: CANNON_Y - PENGUIN_RADIUS,
    vx: 0,
    vy: 0,
    mass: 1,
    isDiving: false
};
let springs = [];
let cameraX = 0; // Camera offset for scrolling
let lastSpringX = 0; // Track last spring position for spacing
let maxDistance = 0;
let canJumpFromRoll = true; // Track if penguin can jump from rolling state
let cannonAngle = -Math.PI / 4; // Current cannon angle (starts at -45 degrees)
let cannonRotationDirection = 1; // 1 for increasing angle, -1 for decreasing
let powerValue = 50; // Current power value (0-100)
let powerDirection = 1; // 1 for increasing, -1 for decreasing

// Initialize game
function init() {
    canvas = document.getElementById('gameCanvas');
    ctx = canvas.getContext('2d');
    
    // Set canvas size and calculate ground position
    updateCanvasSize();
    
    // Resize canvas on window resize
    window.addEventListener('resize', updateCanvasSize);
    
    // Input listeners for game interactions
    canvas.addEventListener('click', handleInput);
    window.addEventListener('keydown', (e) => {
        if (e.code === 'Space') {
            e.preventDefault();
            handleInput();
        }
    });
    
    // Start render loop
    requestAnimationFrame(gameLoop);
}

// Handle all input (space/click)
function handleInput() {
    if (gameState === 'aiming') {
        // Lock angle and switch to power selection
        gameState = 'power_select';
    } else if (gameState === 'power_select') {
        // Launch with selected angle and power
        launchPenguin();
    } else if (gameState === 'flying' && !penguin.isDiving && penguin.y < GROUND_Y - PENGUIN_RADIUS - 5) {
        // Dive down when in air (not already diving and actually airborne)
        penguin.isDiving = true;
        const currentSpeed = Math.sqrt(penguin.vx * penguin.vx + penguin.vy * penguin.vy);
        const boostedSpeed = currentSpeed * DIVE_BOOST;
        const angleRad = (DIVE_ANGLE * Math.PI) / 180;
        penguin.vx = boostedSpeed * Math.cos(angleRad);
        penguin.vy = boostedSpeed * Math.sin(angleRad);
    } else if (gameState === 'rolling' && canJumpFromRoll) {
        // Jump from rolling state
        const angleRad = (JUMP_ANGLE * Math.PI) / 180;
        penguin.vy = -JUMP_SPEED * Math.sin(angleRad);
        penguin.vx += JUMP_SPEED * Math.cos(angleRad);
        gameState = 'flying';
        canJumpFromRoll = false;
    } else if (gameState === 'finished') {
        // Reset game when clicking on finished modal
        reset();
    }
}

// Update canvas size and recalculate ground position
function updateCanvasSize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    GROUND_Y = canvas.height * GROUND_Y_RATIO;
    CANNON_Y = GROUND_Y;
    
    // Reset penguin position if in aiming state
    if (gameState === 'aiming') {
        penguin.x = CANNON_X + Math.cos(cannonAngle) * CANNON_WIDTH;
        penguin.y = CANNON_Y + Math.sin(cannonAngle) * CANNON_WIDTH;
    }
}

// Handle jump input during rolling state
function handleJumpInput() {
    if (gameState === 'rolling' && canJumpFromRoll) {
        // Exit rolling state and jump
        const angleRad = (JUMP_ANGLE * Math.PI) / 180;
        penguin.vy = -JUMP_SPEED * Math.sin(angleRad);
        penguin.vx += JUMP_SPEED * Math.cos(angleRad);
        gameState = 'flying';
        canJumpFromRoll = false; // Disable jump until spring is hit
    }
}

// Launch penguin with selected angle and power
function launchPenguin() {
    const speed = (MIN_LAUNCH_SPEED + (powerValue / 100) * (MAX_LAUNCH_SPEED - MIN_LAUNCH_SPEED)) * VELOCITY_SCALE;
    
    // Use the locked cannon angle
    penguin.vx = speed * Math.cos(cannonAngle);
    penguin.vy = speed * Math.sin(cannonAngle);
    
    gameState = 'flying';
    springs = [];
    lastSpringX = CANNON_X;
    maxDistance = 0;
    canJumpFromRoll = true;
}

// Reset game
function reset() {
    penguin.x = CANNON_X;
    penguin.y = CANNON_Y - PENGUIN_RADIUS;
    penguin.vx = 0;
    penguin.vy = 0;
    penguin.isDiving = false;
    springs = [];
    cameraX = 0;
    lastSpringX = 0;
    maxDistance = 0;
    gameState = 'aiming';
    canJumpFromRoll = true;
    cannonAngle = -Math.PI / 4;
    cannonRotationDirection = 1;
    powerValue = 50;
    powerDirection = 1;
    updateStats();
}

// Physics update
function updatePhysics() {
    // Update cannon rotation in aiming mode
    if (gameState === 'aiming') {
        cannonAngle += CANNON_ROTATION_SPEED * cannonRotationDirection;
        
        // Reverse direction at limits
        if (cannonAngle >= CANNON_MAX_ANGLE) {
            cannonAngle = CANNON_MAX_ANGLE;
            cannonRotationDirection = -1;
        } else if (cannonAngle <= CANNON_MIN_ANGLE) {
            cannonAngle = CANNON_MIN_ANGLE;
            cannonRotationDirection = 1;
        }
        
        // Update penguin position at cannon tip
        penguin.x = CANNON_X + Math.cos(cannonAngle) * CANNON_WIDTH;
        penguin.y = CANNON_Y + Math.sin(cannonAngle) * CANNON_WIDTH;
        return;
    }
    
    // Update power bar in power selection mode
    if (gameState === 'power_select') {
        powerValue += POWER_BAR_SPEED * powerDirection;
        
        // Reverse direction at limits
        if (powerValue >= 100) {
            powerValue = 100;
            powerDirection = -1;
        } else if (powerValue <= 0) {
            powerValue = 0;
            powerDirection = 1;
        }
        return;
    }
    
    if (gameState === 'rolling') {
        // Apply friction while rolling
        penguin.vx *= ROLLING_FRICTION;
        penguin.x += penguin.vx;
        penguin.y = GROUND_Y - PENGUIN_RADIUS; // Keep on ground
        
        // Stop rolling if speed is too low
        if (Math.abs(penguin.vx) < ROLLING_THRESHOLD) {
            gameState = 'finished';
        }
        
        // Update max distance
        const distance = Math.max(0, penguin.x - CANNON_X);
        maxDistance = Math.max(maxDistance, distance);
        
        // Update camera to follow penguin
        cameraX = Math.max(0, penguin.x - canvas.width / 3);
        return;
    }
    
    if (gameState !== 'flying') return;
    
    // Apply gravity
    penguin.vy += GRAVITY;
    
    // Update position
    penguin.x += penguin.vx;
    penguin.y += penguin.vy;
    
    // Check ground collision
    if (penguin.y >= GROUND_Y - PENGUIN_RADIUS) {
        penguin.y = GROUND_Y - PENGUIN_RADIUS;
        penguin.vy = -penguin.vy * BOUNCE_DAMPING;
        penguin.vx *= 0.95; // Slight horizontal damping on bounce
        penguin.isDiving = false; // Reset dive state on ground hit
        
        // Check if penguin has lost enough energy to start rolling
        // Trigger rolling while still bouncing (with higher vertical velocity allowed)
        const kineticEnergy = 0.5 * penguin.mass * (penguin.vx * penguin.vx + penguin.vy * penguin.vy);
        if (kineticEnergy < MIN_ENERGY_THRESHOLD && Math.abs(penguin.vy) < 8) {
            gameState = 'rolling';
            penguin.vy = 0;
            // Boost horizontal velocity when entering roll state for more distance
            penguin.vx *= ROLLING_SPEED_MULTIPLIER;
        }
    }
    
    // Check spring collisions (only while flying)
    checkSpringCollisions();
    
    // Generate new springs ahead of penguin
    generateSprings();
    
    // Update max distance
    const distance = Math.max(0, penguin.x - CANNON_X);
    maxDistance = Math.max(maxDistance, distance);
    
    // Update camera to follow penguin
    cameraX = Math.max(0, penguin.x - canvas.width / 3);
}

// Generate springs dynamically
function generateSprings() {
    // Spawn springs ahead of the penguin's current position
    while (lastSpringX < penguin.x + SPRING_SPAWN_DISTANCE) {
        // Fully randomized distance between springs
        const randomDistance = MIN_SPRING_DISTANCE + Math.random() * (MAX_SPRING_DISTANCE - MIN_SPRING_DISTANCE);
        const springX = lastSpringX + randomDistance;
        const springY = GROUND_Y - SPRING_HEIGHT; // Place on ground
        const springWidth = SPRING_WIDTHS[Math.floor(Math.random() * SPRING_WIDTHS.length)]; // Random width
        
        springs.push({
            x: springX,
            y: springY,
            width: springWidth,
            used: false // Springs are single-use to make game more strategic
        });
        
        lastSpringX = springX;
    }
    
    // Remove springs that are far behind the camera
    springs = springs.filter(spring => spring.x > cameraX - 200);
}

// Check collisions with springs
function checkSpringCollisions() {
    for (let spring of springs) {
        if (spring.used) continue;
        
        // Define the active area of the spring (top 20% of spring height)
        const activeHeight = SPRING_HEIGHT * 0.2;
        const activeTop = spring.y;
        const activeBottom = spring.y + activeHeight;
        
        // Extend the active width beyond the spring itself for easier hitting
        const activeWidthExtension = spring.width * 0.3; // 30% wider on each side
        const activeLeft = spring.x - activeWidthExtension;
        const activeRight = spring.x + spring.width + activeWidthExtension;
        
        // Penguin collision box
        const penguinLeft = penguin.x - PENGUIN_RADIUS;
        const penguinRight = penguin.x + PENGUIN_RADIUS;
        const penguinTop = penguin.y - PENGUIN_RADIUS;
        const penguinBottom = penguin.y + PENGUIN_RADIUS;
        
        // Check if penguin is hitting the active area from top or corner
        // Only trigger if penguin's bottom is within the active area and moving downward
        if (penguinRight > activeLeft && penguinLeft < activeRight &&
            penguinBottom > activeTop && penguinTop < activeBottom &&
            penguin.vy >= 0) { // Only if moving downward or horizontal
            
            // Collision detected - force 45° launch angle
            const speed = Math.max(Math.sqrt(penguin.vx * penguin.vx + penguin.vy * penguin.vy), SPRING_BOOST);
            const angle = Math.PI / 4; // 45 degrees upward
            penguin.vx = speed * Math.cos(angle);
            penguin.vy = -speed * Math.sin(angle);
            spring.used = true;
            canJumpFromRoll = true; // Re-enable jump ability after hitting spring
            penguin.isDiving = false; // Reset dive state on spring hit
        }
    }
}

// Render game
function render() {
    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Draw sky gradient
    const skyGradient = ctx.createLinearGradient(0, 0, 0, GROUND_Y);
    skyGradient.addColorStop(0, '#87CEEB');
    skyGradient.addColorStop(1, '#E0F6FF');
    ctx.fillStyle = skyGradient;
    ctx.fillRect(0, 0, canvas.width, GROUND_Y);
    
    // Draw ground
    ctx.fillStyle = '#8B7355';
    ctx.fillRect(0, GROUND_Y, canvas.width, canvas.height - GROUND_Y);
    
    // Save context for camera translation
    ctx.save();
    ctx.translate(-cameraX, 0);
    
    // Draw ground line
    ctx.strokeStyle = '#654321';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(0, GROUND_Y);
    ctx.lineTo(cameraX + canvas.width, GROUND_Y);
    ctx.stroke();
    
    // Draw cannon (only in aiming and power_select modes)
    if (gameState === 'aiming' || gameState === 'power_select') {
        ctx.save();
        ctx.translate(CANNON_X, CANNON_Y);
        ctx.rotate(cannonAngle);
        
        // Draw cannon barrel as black rectangle
        ctx.fillStyle = '#000';
        ctx.fillRect(0, -CANNON_HEIGHT / 2, CANNON_WIDTH, CANNON_HEIGHT);
        
        ctx.restore();
        
        // Draw cannon base
        ctx.fillStyle = '#333';
        ctx.beginPath();
        ctx.arc(CANNON_X, CANNON_Y, 15, 0, Math.PI * 2);
        ctx.fill();
    }
    
    // Draw springs
    springs.forEach(spring => {
        ctx.fillStyle = spring.used ? '#999' : '#32CD32';
        ctx.fillRect(spring.x, spring.y, spring.width, SPRING_HEIGHT);
        
        // Draw spring coil effect
        ctx.strokeStyle = spring.used ? '#666' : '#228B22';
        ctx.lineWidth = 2;
        for (let i = 0; i < 5; i++) {
            const y = spring.y + (i * SPRING_HEIGHT / 5);
            ctx.beginPath();
            ctx.moveTo(spring.x, y);
            ctx.lineTo(spring.x + spring.width, y);
            ctx.stroke();
        }
        
        // Draw emoji centered on spring
        ctx.font = '20px Arial';
        const emojiX = spring.x + (spring.width / 2) - 10;
        ctx.fillText('🌀', emojiX, spring.y + 25);
    });
    
    // Draw penguin
    if (gameState === 'rolling') {
        // Red background circle for debugging rolling state
        ctx.fillStyle = 'red';
        ctx.beginPath();
        ctx.arc(penguin.x, penguin.y, PENGUIN_RADIUS + 5, 0, Math.PI * 2);
        ctx.fill();
    }
    
    ctx.fillStyle = '#4169E1';
    ctx.beginPath();
    ctx.arc(penguin.x, penguin.y, PENGUIN_RADIUS, 0, Math.PI * 2);
    ctx.fill();
    
    // Draw penguin emoji
    ctx.font = '25px Arial';
    ctx.fillText('🐧', penguin.x - 12, penguin.y + 8);
    
    // Restore context
    ctx.restore();
    
    // Draw power bar UI (without camera translation)
    if (gameState === 'power_select') {
        const barX = canvas.width / 2 - POWER_BAR_WIDTH / 2;
        const barY = 100;
        
        // Draw background
        ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
        ctx.fillRect(barX - 10, barY - 10, POWER_BAR_WIDTH + 20, POWER_BAR_HEIGHT + 40);
        
        // Draw label
        ctx.fillStyle = 'white';
        ctx.font = '20px Arial';
        ctx.textAlign = 'center';
        ctx.fillText('POWER', canvas.width / 2, barY - 20);
        
        // Draw power bar border
        ctx.strokeStyle = 'white';
        ctx.lineWidth = 2;
        ctx.strokeRect(barX, barY, POWER_BAR_WIDTH, POWER_BAR_HEIGHT);
        
        // Draw power bar fill
        const fillWidth = (powerValue / 100) * POWER_BAR_WIDTH;
        ctx.fillStyle = '#4CAF50';
        ctx.fillRect(barX, barY, fillWidth, POWER_BAR_HEIGHT);
        
        ctx.textAlign = 'left';
    }
    
    // Draw aiming instruction
    if (gameState === 'aiming') {
        ctx.fillStyle = 'white';
        ctx.font = 'bold 24px Arial';
        ctx.textAlign = 'center';
        ctx.fillText('Press SPACE or CLICK to lock angle', canvas.width / 2, 100);
        ctx.textAlign = 'left';
    }
    
    // Draw finished modal
    if (gameState === 'finished') {
        // Semi-transparent overlay
        ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        // Modal box
        const modalWidth = 400;
        const modalHeight = 250;
        const modalX = canvas.width / 2 - modalWidth / 2;
        const modalY = canvas.height / 2 - modalHeight / 2;
        
        ctx.fillStyle = 'white';
        ctx.fillRect(modalX, modalY, modalWidth, modalHeight);
        
        // Title
        ctx.fillStyle = '#333';
        ctx.font = 'bold 36px Arial';
        ctx.textAlign = 'center';
        ctx.fillText('Game Over!', canvas.width / 2, modalY + 60);
        
        // Distance
        const distance = Math.max(0, Math.round(maxDistance / 10));
        ctx.font = 'bold 48px Arial';
        ctx.fillStyle = '#4CAF50';
        ctx.fillText(distance + 'm', canvas.width / 2, modalY + 120);
        
        // Play again button
        const buttonWidth = 200;
        const buttonHeight = 50;
        const buttonX = canvas.width / 2 - buttonWidth / 2;
        const buttonY = modalY + modalHeight - 80;
        
        ctx.fillStyle = '#4CAF50';
        ctx.fillRect(buttonX, buttonY, buttonWidth, buttonHeight);
        
        ctx.fillStyle = 'white';
        ctx.font = 'bold 24px Arial';
        ctx.fillText('Play Again', canvas.width / 2, buttonY + 33);
        
        ctx.textAlign = 'left';
    }
    
    // Update stats display
    updateStats();
}

// Update stats display
function updateStats() {
    const distance = Math.max(0, Math.round(maxDistance / 10)); // Scale to meters
    // Display actual speed accounting for velocity scaling
    const actualSpeed = Math.sqrt(penguin.vx * penguin.vx + penguin.vy * penguin.vy) / VELOCITY_SCALE;
    const speed = actualSpeed.toFixed(1);
    
    document.getElementById('distance').textContent = distance;
    document.getElementById('speed-display').textContent = (gameState === 'flying' || gameState === 'rolling') ? speed : '0';
}

// Main game loop
function gameLoop() {
    updatePhysics();
    render();
    requestAnimationFrame(gameLoop);
}

// Start game when page loads
window.addEventListener('load', init);