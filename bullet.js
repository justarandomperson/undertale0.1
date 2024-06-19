export const types = {
  bone: {
    size: {
      width: 100,
      height: 50,
    },
    src: "assets/bullets/bone.png",
    sprites: 1,
    scale: 1,
  },
  gasterblaster: {
    size: {
      width: 47.16,
      height: 57,
    },
    src: "assets/spritesheets/gasterblaster.png",
    sprites: 4,
    scale: 2,
  },
};

export class Bullet {
  constructor(game, x, y, speed, type, rotation = 0, rotation_speed = 0) {
    this.game = game;
    this.width = types[type].size.width;
    this.height = types[type].size.height;
    this.x = x;
    this.y = y;
    this.speed = speed;
    this.type = type;
    this.rotation = rotation;
    this.rotation_speed = rotation_speed;
    this.sprite = 0;
    this.sprites = types[type].sprites;
    this.scale = types[type].scale;
    this.image = new Image();
    this.image.src = types[type].src;
  }

  update() {
    this.x += this.speed;
    this.rotation += this.rotation_speed;
    if (
      (this.x > this.game.width && this.speed > 0) ||
      (this.x < -100 && this.speed < 0)
    ) {
      this.game.bullets[this.game.bullets.indexOf(this)] = null;
    }
    if (this.sprites > 1) this.sprite++;
    if (this.sprite >= types[this.type].sprites) this.sprite = 0;
  }
  draw(ctx) {
    ctx.save();
    ctx.translate(this.x + this.width / 2, this.y + this.height / 2);
    const rad = (this.rotation * Math.PI) / 180;
    ctx.rotate(rad);
    if (this.sprites > 1) {
      ctx.drawImage(
        this.image,
        this.sprite * this.width,
        0,
        this.width,
        this.height,
        this.width * -1,
        this.height * -1,
        this.width * this.scale,
        this.height * this.scale
      );
    } else {
      ctx.drawImage(
        this.image,
        (this.width / 2) * -1,
        (this.height / 2) * -1,
        this.width,
        this.height
      );
    }
    ctx.restore();
  }
}
