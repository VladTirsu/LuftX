import { BaseGameObject } from "../baseGameObject.js";
import { global } from "../global.js";

class Player extends BaseGameObject {
    speed = 5;

    constructor(x, y) {
        super(x, y, 200, 200, [
            "../images/jet1.png",
            "../images/jet2.png"
        ]);
        this.name = "player";
    }

    // Collision box smaller than the sprite
    getBoxBounds() {
        let size = 100;
        let left = this.x + (this.width - size) / 2;
        let top = this.y + (this.height - size) / 2;
        return {
            left: left,
            right: left + size,
            top: top,
            bottom: top + size
        };
    }

    update() {
        // Move based on keyboard input
        if (global.keys.w) this.y -= this.speed;
        if (global.keys.s) this.y += this.speed;
        if (global.keys.a) this.x -= this.speed;
        if (global.keys.d) this.x += this.speed;


        // Keep player on screen
        this.x = Math.max(0, Math.min(this.x, 1600 - this.width));
        this.y = Math.max(0, Math.min(this.y, 1080 - this.height));
    }

    // What happens when player is hit
    reactToCollision(other) {
        if (other.name === "enemy" || other.name === "enemyBullet") {
            other.active = false;
            global.hearts--;
            if (global.hearts <= 0) {
                global.gameOver = true;
            }
        }
    }
}

export { Player };