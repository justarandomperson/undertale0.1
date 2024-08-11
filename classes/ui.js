export class UI {
  constructor(data, optional) {
    const { game, x, y, width, height } = data;
    const {
      src,
      type,
      maxValue,
      color,
      backgroundColor,
      borderColor,
      spritesheet,
      scale,
      name,
    } = optional || {};
    this.game = game;
    this.name = name;
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.scale = scale || 1;
    this.type = type;
    this.borderColor = borderColor;
    this.backgroundColor = backgroundColor;
    this.frame_count = 0;
    if (spritesheet) {
      this.spriteindex = 0;
    }
    if (src) {
      this.image = new Image();
      this.image.src = src;
    }
    if (type == "bar") {
      this.value = maxValue;
      this.maxValue = maxValue;
      this.color = color;
      this.maxWidth = width;
    }
  }

  draw(ctx) {
    if (this.borderColor) {
      ctx.strokeStyle = this.borderColor;
      ctx.lineWidth = 5;
      ctx.strokeRect(this.x, this.y, this.width, this.height);
    }
    if (this.backgroundColor) {
      ctx.fillStyle = this.backgroundColor;
      ctx.fillRect(this.x, this.y, this.maxWidth || this.width, this.height);
    }
    if (this.type == "bar") {
      ctx.fillStyle = this.color;
      ctx.fillRect(this.x, this.y, this.width, this.height);
    }
    if (this.image && !this.hasOwnProperty("spriteindex")) {
      ctx.drawImage(
        this.image,
        this.x,
        this.y,
        this.width * this.scale,
        this.height * this.scale
      );
    } else if (this.image) {
      ctx.drawImage(
        this.image,
        this.spriteindex * this.width,
        0,
        this.width,
        this.height,
        this.x,
        this.y,
        this.width * this.scale,
        this.height * this.scale
      );
    }
  }
  update(optional) {
    this.frame_count++;
    if (this.hasOwnProperty("spriteindex")) {
      if (this.frame_count > 5) {
        this.spriteindex++;
        this.frame_count = 0;
      }
    }
    if (this.type == "bar") {
      const { value } = optional;
      if (value < 0) return;
      this.value = value;
      this.width = (this.value / this.maxValue) * this.maxWidth;
    }
    if (this.type == "fight_bar") {
      this.x += 13;
      if (this.x > this.game.box.x + this.game.box.width) {
        this.game.ui.splice(this.game.ui.indexOf(this), 1);
      }
    }
  }
}
