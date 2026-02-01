// Canvas and drawing context
const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
canvas.width = 1600;
canvas.height = 1080;

// Global game state which shared across all files
const global = {
    canvas: canvas,
    ctx: ctx,

    // Time tracking
    deltaTime: 0,
    previousTotalTime: 0,

    // Game objects list
    allGameObjects: [],

    // Game statistics
    hearts: 3,
    score: 0,
    currentWave: 0,
    gameOver: false,
    loggedFinalScore: false,
    paused: false,

    keys: {
        w: false,
        a: false,
        s: false,
        d: false
    },

    // if two objects are colliding
    checkCollision(obj1, obj2) {
        let box1 = obj1.getBoxBounds();
        let box2 = obj2.getBoxBounds();

        return (
            box1.left < box2.right &&
            box1.right > box2.left &&
            box1.top < box2.bottom &&
            box1.bottom > box2.top
        );
    },

    // Update UI displays
    updateDisplay() {
        document.getElementById("healthDisplay").innerText = "Lives: " + "⚡".repeat(this.hearts);
        document.getElementById("scoreDisplay").innerText = "Score: " + this.score;
        document.getElementById("waveDisplay").innerText = "Wave: " + this.currentWave;
    }
};

export { global };