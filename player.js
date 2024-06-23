import { detectRectangleCollision } from "./collision.js";

export class Player {
  constructor(game) {
    this.game = game;
    this.width = 50;
    this.height = 50;
    this.x = game.box.x + game.box.width / 2 - this.width / 2;
    this.y = game.box.y + game.box.height / 2 - this.height;
    this.speed = 2.5;
    this.scale = 2;
    this.image = new Image();
    this.rotation = 0;
    this.image.src = "assets/other/soul.png";
  }

  update(input) {
    if (input.includes("ArrowRight") || input.includes("d")) {
      if (this.x < this.game.box.x + this.game.box.width - this.width)
        this.x += this.speed;
    }
    if (input.includes("ArrowLeft") || input.includes("a")) {
      if (this.x > this.game.box.x) this.x -= this.speed;
    }
    if (input.includes("ArrowUp") || input.includes("w")) {
      if (this.y > this.game.box.y) this.y -= this.speed;
    }
    if (input.includes("ArrowDown") || input.includes("s")) {
      if (this.y < this.game.box.y + this.game.box.height - this.height)
        this.y += this.speed;
    }
  }
  draw(ctx) {
    ctx.drawImage(this.image, this.x, this.y, this.width, this.height);
  }

  checkCollision(bullets) {
    bullets.forEach((bullet) => {
      if (bullet === null) return;
      let bulletWidth = bullet.width;
      let bulletHeight = bullet.height;
      let bulletX = bullet.x;

      if (bullet.type == "beam") {
        if (bullet.beam_rotation == 0 || bullet.beam_rotation == 180) {
          bulletHeight *= 2.35;
          bulletWidth *= 1.9;
        } else {
          bulletWidth *= 2.35;
          bulletHeight *= 1.9;
        }
      }
      if (
        detectRectangleCollision(
          {
            x: this.x,
            y: this.y,
            width: this.width,
            height: this.height,
            currRotation: this.rotation,
          },
          {
            x: bulletX,
            y: bullet.y,
            width: bulletWidth,
            height: bulletHeight,
            currRotation: bullet.rotation,
          }
        ) &&
        Date.now() - bullet.lastHit > bullet.cooldown
      ) {
        const damage = bullet.damage;
        bullet.lastHit = Date.now();
        this.game.hp_bar.update({
          value: this.game.hp_bar.value - damage,
        });
      }
    });
  }
}
