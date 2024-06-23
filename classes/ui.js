export class UI {
  constructor(data, optional) {
    const { game, x, y, width, height } = data;
    const { src, type, maxValue, color, backgroundColor, borderColor } =
      optional || {};
    this.game = game;
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.type = type;
    this.borderColor = borderColor;
    this.backgroundColor = backgroundColor;
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
  }
  update(optional) {
    if (this.type == "bar") {
      const { value } = optional;
      if (value < 0) return;
      this.value = value;
      this.width = (this.value / this.maxValue) * this.maxWidth;
    }
  }
}
