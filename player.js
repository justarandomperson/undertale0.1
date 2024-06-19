export class Player {
  constructor(game) {
    this.game = game;
    this.width = 50;
    this.height = 50;
    this.x = 0;
    this.y = 0;
    this.speed = 2.5;
    this.image = new Image();
    this.image.src = "assets/other/soul.png";
  }

  update(input) {
    if (input.includes("ArrowRight") || input.includes("d")) {
      if (this.x < this.game.width - this.width) this.x += this.speed;
    }
    if (input.includes("ArrowLeft") || input.includes("a")) {
      if (this.x > 0) this.x -= this.speed;
    }
    if (input.includes("ArrowUp") || input.includes("w")) {
      if (this.y > 0) this.y -= this.speed;
    }
    if (input.includes("ArrowDown") || input.includes("s")) {
      if (this.y < this.game.height - this.height) this.y += this.speed;
    }
  }
  draw(ctx) {
    ctx.fillStyle = "red";
    ctx.drawImage(this.image, this.x, this.y, this.width, this.height);
  }
}
