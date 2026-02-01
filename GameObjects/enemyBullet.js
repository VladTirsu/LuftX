import { BaseGameObject } from "../baseGameObject.js";
import { global } from "../global.js";

class EnemyBullet extends BaseGameObject {
    speed = 5;

    constructor(x, y) {
        super(x, y - 23, 30, 30, ["../images/MainBullet.png"]);
        this.name = "enemyBullet";
        this.yVelocity = this.speed; // Positive = move down
    }

    update() {
        // Move downward
        this.y += this.yVelocity;
        
        // Remove if off screen
        if (this.y > global.canvas.height + 50) {
            this.active = false;
        }
    }

    // Draw bullet flipped vertically which pointing down
    draw() {
        this.animation.timer++;
        if (this.animation.timer >= this.animation.delay) {
            this.animation.timer = 0;
            this.animation.frame = (this.animation.frame + 1) % this.animation.images.length;
        }

        // Flip image to point downward
        global.ctx.save();
        global.ctx.translate(this.x + this.width / 2, this.y + this.height / 2);
        global.ctx.scale(1, -1);
        global.ctx.drawImage(
            this.animation.images[this.animation.frame],
            -this.width / 2,
            -this.height / 2,
            this.width,
            this.height
        );
        global.ctx.restore();
    }
}

export { EnemyBullet };
