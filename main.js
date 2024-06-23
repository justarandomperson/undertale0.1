import { Player } from "./player.js";
import { groundBone, targetBone } from "./attacks.js";
import { GasterBlaster } from "./bullet.js";
import { UI } from "./classes.js";
import { InputHandler } from "./input.js";

const game_canvas = document.querySelector(".game");
const ctx = game_canvas.getContext("2d");

game_canvas.width = 1200;
game_canvas.height = 800;

const box = { width: 1000, height: 400 };

ctx.webkitImageSmoothingEnabled = false;
ctx.mozImageSmoothingEnabled = false;
ctx.imageSmoothingEnabled = false;

class Game {
  constructor(width, height) {
    this.width = width;
    this.height = height;
    this.bullets = [];
    this.outbullets = [];
    this.effects = [];
    this.input = new InputHandler();

    (this.hp_bar = new UI(
      {
        game: this,
        x: this.width / 2 - 200,
        y: this.height - 55,
        width: 400,
        height: 50,
      },
      { type: "bar", maxValue: 100, color: "yellow", backgroundColor: "red" }
    )),
      (this.box = new UI(
        {
          width: box.width,
          height: box.height,
          x: this.width / 2 - box.width / 2,
          y: this.height / 2.5,
        },
        { borderColor: "white" }
      ));
    this.mask = [
      new UI(
        {
          x: 0,
          y: 0,
          width: this.box.x,
          height: this.height,
        },
        { backgroundColor: "black" }
      ),
      new UI(
        {
          x: this.box.x + this.box.width,
          y: 0,
          width: 100,
          height: this.height,
        },
        { backgroundColor: "black" }
      ),
    ];
    this.player = new Player(this);
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
    this.mask.forEach((mask) => {
      mask.draw(ctx);
    });
    this.outbullets.forEach((bullet) => {
      if (bullet == null) return;
      bullet.update();
      bullet.draw(ctx);
    });
    this.effects.forEach((effect) => {
      if (effect == null) return;
      effect.update();
      effect.draw(ctx);
    });
    this.box.draw(ctx);
    this.player.checkCollision([...this.bullets, ...this.outbullets]);
    this.hp_bar.draw(ctx);
  }
}

const game = new Game(game_canvas.width, game_canvas.height);

const animate = () => {
  game.update();
  game.draw(ctx);
  requestAnimationFrame(animate);
};

animate();

setInterval(() => {
  let random_y = game.box.y + parseInt(Math.random() * game.box.height) - 47;
  const blaster = new GasterBlaster(game, 100, random_y, 0.5, 270);
  game.effects.push(blaster);
  targetBone(game, 1, 5, 0, 5);
  targetBone(game, 1, 5, 90, 5);
  groundBone(game, 1, 3);
  setTimeout(() => {
    random_y = game.box.y + parseInt(Math.random() * game.box.height) - 47;
    const blaster3 = new GasterBlaster(game, game.box.width, random_y, 0.5, 90);
    game.effects.push(blaster3);
  }, 500);
}, 1000);
