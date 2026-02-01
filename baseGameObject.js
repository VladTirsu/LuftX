import { global } from "./global.js";

// Base class for all game objects (player, enemies, bullets, etc.)
class BaseGameObject {
    name = "";
    active = true;
    x = 0;
    y = 0;
    width = 0;
    height = 0;
    xVelocity = 0;
    yVelocity = 0;

    animation = {
        images: [],
        frame: 0,
        timer: 0,
        delay: 15
    };

    constructor(x, y, width, height, imagePaths) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;

        // Load all images for animation
        for (let i = 0; i < imagePaths.length; i++) {
            let img = new Image();
            img.src = imagePaths[i];
            this.animation.images.push(img);
        }

        // Add to game object list
        global.allGameObjects.push(this);
    }

    // Get collision box which can be overridden by child classes)
    getBoxBounds() {
        return {
            left: this.x,
            right: this.x + this.width,
            top: this.y,
            bottom: this.y + this.height
        };
    }

    // Update position which can be overridden by child classes
    update() {
        this.x += this.xVelocity;
        this.y += this.yVelocity;
    }

    // Draw sprite with animation which can be overridden by child classes
    draw() {
        // Advance animation frame
        this.animation.timer++;
        if (this.animation.timer >= this.animation.delay) {
            this.animation.timer = 0;
            this.animation.frame = (this.animation.frame + 1) % this.animation.images.length;
        }

        // Draw current frame
        global.ctx.drawImage(
            this.animation.images[this.animation.frame],
            this.x,
            this.y,
            this.width,
            this.height
        );
    }

    // Handle collisions which overridden by child classes
    reactToCollision() {}
}

export { BaseGameObject };