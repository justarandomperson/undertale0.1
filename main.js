import { Player } from "./player.js";
import { groundBone, targetBone } from "./attacks.js";
import { InputHandler } from "./input.js";

const canvas = document.querySelector("canvas");
const ctx = canvas.getContext("2d");

canvas.width = 500;
canvas.height = 500;
class Game {
  constructor(width, height) {
    this.width = width;
    this.height = height;
    this.player = new Player(this);
    this.bullets = [];
    this.input = new InputHandler();
  }

  update() {
    this.player.update(this.input.keys);
  }
  draw(ctx) {
    ctx.clearRect(0, 0, this.width, this.height);
    this.player.draw(ctx);
    this.bullets.forEach((bullet) => {
      if (bullet === null) return;
      bullet.update();
      bullet.draw(ctx);
    });
  }
}

const game = new Game(canvas.width, canvas.height);

const animate = () => {
  game.update();
  game.draw(ctx);
  requestAnimationFrame(animate);
};

animate();

setInterval(() => {
  groundBone(game, 2);
  groundBone(game, -2);
  targetBone(game, 4, 0, 5);
  targetBone(game, 4, 90, 5);
}, 1000);
