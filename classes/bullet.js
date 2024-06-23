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
    sprites: 5,
    scale: 2.4,
  },
};

export class Bullet {
  constructor(
    game,
    x,
    y,
    speed,
    type,
    damage,
    bounds = true,
    rotation = 0,
    rotation_speed = 0,
    optional
  ) {
    this.game = game;
    this.width = types[type].size.width;
    this.height = types[type].size.height;
    this.sprites = types[type].sprites;
    this.scale = types[type].scale;
    this.x = x;
    this.y = y;
    this.speed = speed;
    this.type = type;
    this.damage = damage;
    this.rotation = rotation;
    this.rotation_speed = rotation_speed;
    this.sprite = 0;

    this.image = new Image();
    this.image.src = types[type].src;

    this.lastHit = Date.now();
    this.cooldown = 15;
    if (this.y == "bottom") {
      this.y = game.box.y + game.box.height - this.height * 1.35;
    }
  }

  update() {
    this.x += this.speed;
    this.rotation += this.rotation_speed;
    if (
      (this.x > this.game.box.x + this.game.box.width - this.width / 2 + 50 &&
        this.speed > 0) ||
      (this.x < this.game.box.x - this.width / 2 - 50 && this.speed < 0)
    ) {
      this.game.bullets[this.game.bullets.indexOf(this)] = null;
    }
    if (this.sprites > 1) this.sprite++;
    if (this.sprite >= this.sprites) this.sprite = 0;
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

export class Beam {
  constructor(game, gaster_blaster, scale) {
    this.game = game;
    this.gaster_blaster = gaster_blaster;
    this.type = "beam";
    this.scale = gaster_blaster.scale;
    this.beam_scale = scale;
    this.damage = gaster_blaster.damage;
    this.rotation = 0;
    this.beam_rotation = gaster_blaster.dest_rotation;
    this.state = 0;
    this.opacity = 1;

    this.lastHit = Date.now();
    this.cooldown = 7.5;

    if (this.beam_rotation == 90 || this.beam_rotation == 270) {
      if (this.beam_rotation == 90) {
        this.x = gaster_blaster.x - game.width;
        this.width = game.width / gaster_blaster.scale;
      } else {
        this.x = gaster_blaster.x;
        this.width = game.width;
      }
    } else {
      if (this.beam_rotation == 0) {
        this.y = gaster_blaster.y;
        this.height = game.height;
      } else {
        this.y = gaster_blaster.y - game.height;
        this.height = game.height / gaster_blaster.scale;
      }
    }

    this.changeSize(scale);
  }

  changeSize(scale) {
    if (this.gaster_blaster.scale == 2.4) {
      if (this.beam_rotation == 90 || this.beam_rotation == 270) {
        this.height =
          this.gaster_blaster.height / this.gaster_blaster.scale / scale;
        this.y = this.gaster_blaster.y;
        if (this.beam_rotation == 90) {
          this.y += this.gaster_blaster.height / 2 - this.height / 2 / scale;
        } else {
          this.y -= this.height / 2 / scale - scale / 1.5;
        }
      } else {
        this.width =
          this.gaster_blaster.width / this.gaster_blaster.scale / scale;
        this.x = this.gaster_blaster.x;
        this.x -= this.width / 2 / scale + 2;
      }
      this.beam_scale = scale;
    }
  }

  update() {}

  draw(ctx) {
    ctx.save();
    ctx.translate(this.x + this.width / 2, this.y + this.height / 2);
    ctx.fillStyle = `rgba(255, 255, 255, ${this.opacity})`;
    ctx.fillRect(
      (this.width / 2) * -1,
      (this.height / 2) * -1,
      this.width * this.scale,
      this.height * this.scale
    );
    ctx.restore();
  }
}

export class GasterBlaster {
  constructor(game, x, y, damage, rotation = 0) {
    this.game = game;
    this.dest_x = x;
    this.dest_y = y;
    this.dest_rotation = rotation;
    this.x = x > 500 ? x + 500 : x - 500;
    this.y = y > 500 ? y + 500 : y - 500;
    this.damage = damage;
    this.state = "hovering";
    this.rotation = this.dest_rotation + 200;
    this.rotation_speed = 8.5;
    this.frameCount = 0;
    this.direction_speed_x = 0;
    this.direction_speed_y = 0;
    this.beam = null;
    if (this.dest_rotation == 90) {
      this.direction_speed_x = -8;
    } else if (this.dest_rotation == 180) {
      this.direction_speed_y = -8;
    } else if (this.dest_rotation == 270) {
      this.direction_speed_x = 8;
    } else if (this.dest_rotation == 0) {
      this.direction_speed_y = 8;
    }

    this.width = types.gasterblaster.size.width;
    this.height = types.gasterblaster.size.height;
    this.sprite = 0;
    this.sprites = types.gasterblaster.sprites;
    this.scale = types.gasterblaster.scale;
    this.image = new Image();
    this.image.src = types.gasterblaster.src;
  }

  draw(ctx) {
    ctx.save();
    ctx.translate(this.x + this.width / 2, this.y + this.height / 2);
    const rad = (this.rotation * Math.PI) / 180;
    ctx.rotate(rad);
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
    ctx.restore();
  }

  update() {
    this.frameCount++;
    if (this.state == "ready" || this.state == "firing") {
      if (this.frameCount > 5) {
        if (this.state == "ready") {
          this.frameCount = 0;
          this.sprite += 1;

          if (this.sprite == 3 && this.beam == null) {
            const beam = new Beam(this.game, this, 2.5);
            this.beam = beam;
            this.game.outbullets.push(beam);
          }
          if (this.sprite == 4) {
            this.state = "firing";
            this.beam.changeSize(1.6);
          }
        }
        if (this.state == "firing") {
          this.frameCount = 0;
          this.sprite = this.sprite == 5 ? 4 : 5;
          if (this.beam) {
            if (this.beam.state != 3 && Math.round(this.beam.beam_scale) == 1)
              this.beam.state++;
          }
        }
      }
      if (this.state == "firing") {
        if (this.beam) {
          if (this.beam.state == 0) {
            if (this.beam.beam_scale > 1) {
              this.beam.changeSize(this.beam.beam_scale - 0.1);
            }
          } else if (this.beam.state == 3) {
            if (this.beam.beam_scale < 2) {
              this.beam.changeSize(this.beam.beam_scale + 0.1);
              this.beam.opacity =
                Math.round((this.beam.opacity - 0.1) * 10) / 10;
              if (this.beam.opacity <= 0) {
                this.game.outbullets[this.game.outbullets.indexOf(this.beam)] =
                  null;
                this.beam = null;
              }
            }
          }
        }

        if (this.rotation % 360 == 90) {
          if (this.beam) this.beam.width += 4;
          this.x += 8;
        } else if (this.rotation % 360 == 180) {
          if (this.beam) this.beam.height += 4;
          this.y += 8;
        } else if (this.rotation % 360 == 270) {
          if (this.beam) this.beam.x -= 8;
          this.x -= 8;
        } else if (this.rotation % 360 == 0) {
          if (this.beam) this.beam.y -= 8;
          this.y -= 8;
        }

        if (this.x < this.game.box.x - 100) {
          this.game.outbullets[this.game.outbullets.indexOf(this)] = null;
        }
        if (this.x > this.game.box.x + this.game.box.width + 100) {
          this.game.outbullets[this.game.outbullets.indexOf(this)] = null;
        }
        if (this.y < this.game.box.y - 100) {
          this.game.outbullets[this.game.outbullets.indexOf(this)] = null;
        }
        if (this.y > this.game.box.y + this.game.box.height + 100) {
          this.game.outbullets[this.game.outbullets.indexOf(this)] = null;
        }
      }
      return;
    }
    if (
      (this.rotation % 360) - this.dest_rotation < 3 &&
      (this.rotation % 360) - this.dest_rotation > -3
    ) {
      this.rotation = this.dest_rotation;
    }
    if (
      Math.round(this.x) == this.dest_x &&
      Math.round(this.y) == this.dest_y &&
      this.rotation % 360 == this.dest_rotation
    ) {
      this.state = "ready";
    } else {
      if (this.rotation % 360 != this.dest_rotation)
        this.rotation += this.rotation_speed;
      if (this.x < this.dest_x) this.x += (this.dest_x - this.x) / 5;
      if (this.x > this.dest_x) this.x -= (this.x - this.dest_x) / 5;
      if (this.y < this.dest_y) this.y += (this.dest_y - this.y) / 5;
      if (this.y > this.dest_y) this.y -= (this.y - this.dest_y) / 5;
    }
  }
}
