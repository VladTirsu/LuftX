import { global } from "./global.js";
import { Player } from "./GameObjects/player.js";
import { Bullet } from "./GameObjects/bullet.js";
import { Enemy } from "./GameObjects/enemy.js";

// ===== IMAGE PRELOADER =====
const imageSources = [
    'images/enemychopper1.png',
    'images/enemychopper2.png',
    'images/enemychopper3.png',
    'images/enemychopper4.png',
    'images/jet1.png',
    'images/jet2.png',
    'images/enemyjet.png',
    'images/MainBullet.png',
    'images/gamebg.jpg',
    'images/marginleft.png',
    'images/marginright.png',
    'images/arcadestart.jpg'
];

let loadedImagesCount = 0;
let imagesReady = false;

function preloadImages(callback) {
    if (imageSources.length === 0) {
        callback();
        return;
    }
    
    console.log('🔄 Preloading images...');
    
    imageSources.forEach(src => {
        const img = new Image();
        img.onload = function() {
            loadedImagesCount++;
            console.log(`✅ Loaded (${loadedImagesCount}/${imageSources.length}): ${src}`);
            if (loadedImagesCount === imageSources.length) {
                console.log('🎮 All images loaded! Game ready.');
                imagesReady = true;
                callback();
            }
        };
        img.onerror = function() {
            console.error(`❌ Failed to load: ${src}`);
            loadedImagesCount++;
            if (loadedImagesCount === imageSources.length) {
                imagesReady = true;
                callback();
            }
        };
        img.src = src;
    });
}

// Background setup
const bgCanvas = document.getElementById("bgCanvas");
const bgCtx = bgCanvas.getContext("2d");
bgCtx.imageSmoothingEnabled = false;
const bgImage = new Image();
bgImage.src = "images/gamebg.jpg";

// Background scrolling variables
let bgY1 = 0;
let bgScrollSpeed = 100;
const bgImageHeight = 2180;

// Screen elements
const startScreen = document.getElementById("startScreen");
const gameOverScreen = document.getElementById("gameOverScreen");
const pauseScreen = document.getElementById("pauseScreen");
const startButton = document.getElementById("startButton");
const restartButton = document.getElementById("restartButton");
const pauseRestartButton = document.getElementById("pauseRestartButton");
const finalScoreText = document.getElementById("finalScoreText");

// Game variables
let player = null;
let canShoot = true;
let shootCooldown = 250;
let waveTimer = 0;
let waveDelay = 300;

// Wave patterns
let wavePatterns = [
    [
        { type: "chopper", x: 0.3 },
        { type: "chopper", x: 0.5 },
        { type: "chopper", x: 0.7 }
    ],
    [
        { type: "jet", x: 0.25 },
        { type: "jet", x: 0.4 },
        { type: "jet", x: 0.6 },
        { type: "jet", x: 0.75 }
    ],
    [
        { type: "chopper", x: 0.2 },
        { type: "jet", x: 0.35 },
        { type: "chopper", x: 0.5 },
        { type: "jet", x: 0.65 },
        { type: "chopper", x: 0.8 }
    ]
];

// Spawn a wave of enemies
function spawnWave() {
    global.currentWave++;
    console.log("=== WAVE", global.currentWave, "===");
    
    // Cycle through wave patterns
    let patternIndex = (global.currentWave - 1) % wavePatterns.length;
    let pattern = wavePatterns[patternIndex];
    
    // Create each enemy in the pattern
    for (let i = 0; i < pattern.length; i++) {
        let enemyData = pattern[i];
        let xPos = (global.canvas.width - 150) * enemyData.x;
        new Enemy(xPos, -100, enemyData.type);
    }
}

// Start a new game
function startGame() {
    // Don't start if images aren't loaded yet
    if (!imagesReady) {
        console.log('⏳ Waiting for images to load...');
        setTimeout(startGame, 100);
        return;
    }
    
    // Reset all game variables
    global.allGameObjects = [];
    global.hearts = 3;
    global.score = 0;
    global.currentWave = 0;
    global.gameOver = false;
    global.loggedFinalScore = false;
    global.paused = false;
    waveTimer = 0;
    bgY1 = 0;
    
    // Create player in center bottom
    player = new Player(global.canvas.width / 2 - 100, global.canvas.height - 250);
    
    // Hide all screens
    startScreen.style.display = "none";
    gameOverScreen.style.display = "none";
    pauseScreen.style.display = "none";
    
    // Start first wave and game loop
    spawnWave();
    requestAnimationFrame(gameLoop);
}

// Handle keyboard input
document.addEventListener("keydown", function(e) {
    // Pause/unpause with Escape
    if (e.key === "Escape" && !global.gameOver && startScreen.style.display === "none") {
        global.paused = !global.paused;
        pauseScreen.style.display = global.paused ? "flex" : "none";
        return;
    }
    
    // Movement keys
    if (e.key === "w") global.keys.w = true;
    if (e.key === "a") global.keys.a = true;
    if (e.key === "s") global.keys.s = true;
    if (e.key === "d") global.keys.d = true;
    
    // Shoot with spacebar
    if (e.key === " " && canShoot && !global.gameOver && !global.paused) {
        if (player) {
            new Bullet(player.x + player.width / 2 - 15, player.y);
        }
        canShoot = false;
        setTimeout(function() {
            canShoot = true;
        }, shootCooldown);
    }
});

document.addEventListener("keyup", function(e) {
    if (e.key === "w") global.keys.w = false;
    if (e.key === "a") global.keys.a = false;
    if (e.key === "s") global.keys.s = false;
    if (e.key === "d") global.keys.d = false;
});

// Main game loop which runs every frame
function gameLoop(totalTime) {
    // Calculate time since last frame
    global.deltaTime = totalTime - global.previousTotalTime;
    global.previousTotalTime = totalTime;
    global.deltaTime /= 1000;
    
    // Scroll background
    if (!global.paused && !global.gameOver) {
        bgY1 += bgScrollSpeed * global.deltaTime;
    }
    
    // Wrap background position for seamless looping
    let wrappedY = bgY1 % bgImageHeight;
    if (wrappedY < 0) wrappedY += bgImageHeight;
    
    // Draw background images
    bgCtx.clearRect(0, 0, bgCanvas.width, bgCanvas.height);
    let startY = Math.floor(wrappedY - bgImageHeight);
    let currentY = startY;
    let maxY = bgCanvas.height + bgImageHeight;
    while (currentY < maxY) {
        bgCtx.drawImage(bgImage, 0, currentY, 1600, bgImageHeight);
        currentY = Math.floor(currentY + bgImageHeight);
    }
    
    // Clear game canvas
    global.ctx.clearRect(0, 0, global.canvas.width, global.canvas.height);
    
    // Show game over screen
    if (global.gameOver) {
        gameOverScreen.style.display = "flex";
        finalScoreText.innerText = "Final Score: " + global.score;
        if (!global.loggedFinalScore) {
            console.log("Final Score:", global.score);
            global.loggedFinalScore = true;
        }
        return;
    }
    
    // Don't update if paused
    if (global.paused) {
        requestAnimationFrame(gameLoop);
        return;
    }
    
    // Update and draw all game objects
    for (let i = 0; i < global.allGameObjects.length; i++) {
        let obj = global.allGameObjects[i];
        if (obj.active === false) {
            continue;
        }
        obj.update();
        obj.draw();
        
        // Check collisions with other objects
        for (let j = 0; j < global.allGameObjects.length; j++) {
            if (i === j) continue;
            let otherObj = global.allGameObjects[j];
            if (otherObj.active === false) continue;
            if (global.checkCollision(obj, otherObj)) {
                obj.reactToCollision(otherObj);
            }
        }
    }
    
    // Remove destroyed objects
    global.allGameObjects = global.allGameObjects.filter(obj => obj.active === true);
    
    // Count enemies
    let enemyCount = 0;
    for (let i = 0; i < global.allGameObjects.length; i++) {
        if (global.allGameObjects[i].name === "enemy") {
            enemyCount++;
        }
    }
    
    // Spawn new wave when all enemies are defeated
    if (enemyCount === 0) {
        waveTimer++;
        if (waveTimer >= waveDelay) {
            spawnWave();
            waveTimer = 0;
        }
    }
    
    // Update UI displays
    global.updateDisplay();
    
    // Continue game loop
    requestAnimationFrame(gameLoop);
}

// Button click handlers
startButton.addEventListener("click", startGame);
restartButton.addEventListener("click", startGame);
pauseRestartButton.addEventListener("click", startGame);

// ===== START PRELOADING IMAGES ON PAGE LOAD =====
preloadImages(() => {
    console.log('✅ Images preloaded, game ready to start!');
});
