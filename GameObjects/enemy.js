import { BaseGameObject } from "../baseGameObject.js";
import { global } from "../global.js";
import { EnemyBullet } from "./enemyBullet.js";

class Enemy extends BaseGameObject {
    speed = 2;
    shootTimer = 0;
    shootDelay = 120;
    type = "chopper";

    constructor(x, y, type) {
        // Choose images based on enemy type
        let images = [];
        if (type === "jet") {
            images = ["../images/enemyjet.png", "../images/enemyjet2.png"];
        } else {
            images = [
                "../images/enemychopper1.png",
                "../images/enemychopper2.png",
                "../images/enemychopper3.png",
                "../images/enemychopper4.png"
            ];
        }

        super(x, y, 150, 150, images);
        this.name = "enemy";
        this.type = type;
        this.yVelocity = this.speed;
    }

    // Get collision box which smaller than sprite for better gameplay
    getBoxBounds() {
        if (this.type === "jet") {
            let w = 125;
            let h = 50;
            let left = this.x + (this.width - w) / 2;
            let top = this.y + (this.height - h) / 2;
            return { left, right: left + w, top, bottom: top + h };
        } else {
            // chopper
            let size = 88;
            let left = this.x + (this.width - size) / 2;
            let top = this.y + (this.height - size) / 2;
            return { left, right: left + size, top, bottom: top + size };
        }
    }

    update() {
        // Move down until reaching stop position
        this.y += this.yVelocity;

        let stopY = global.canvas.height * 0.25;
        if (this.y >= stopY) {
            this.y = stopY;
            this.yVelocity = 0;

            // Keep enemy on screen
            this.x = Math.max(0, Math.min(this.x, global.canvas.width - this.width));

            // Shoot bullets periodically
            this.shootTimer++;
            if (this.shootTimer >= this.shootDelay) {
                new EnemyBullet(this.x + this.width / 2 - 15, this.y + this.height);
                this.shootTimer = 0;
            }
        }
    }

    // What happens when enemy is hit
    reactToCollision(other) {
        if (other.name === "bullet") {
            this.active = false;
            other.active = false;
            global.score += 25;
        }
    }
}

export { Enemy };