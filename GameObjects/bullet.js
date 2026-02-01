import { BaseGameObject } from "../baseGameObject.js";
import { global } from "../global.js";

class Bullet extends BaseGameObject {
    speed = 15;

    constructor(x, y) {
        super(x - 10, y - 10, 50, 50, ["../images/MainBullet.png"]);
        this.name = "bullet";
        this.yVelocity = -this.speed; // Negative = move up
    }

    update() {
        // Move upward
        this.y += this.yVelocity;
        
        // Remove if off screen
        if (this.y < -50) {
            this.active = false;
        }
    }

    // What happens when bullet hits something
    reactToCollision(other) {
        if (other.name === "enemy") {
            this.active = false;
            other.active = false;
            global.score += 25;
        }
    }
}

export { Bullet };
