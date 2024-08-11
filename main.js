import { Game } from "./classes/game.js";
import { groundBone, targetBone } from "./attacks.js";
import { GasterBlaster } from "./classes/bullet.js";

const game_canvas = document.querySelector(".game");
const ctx = game_canvas.getContext("2d");

game_canvas.width = 1600;
game_canvas.height = 800;

ctx.webkitImageSmoothingEnabled = false;
ctx.mozImageSmoothingEnabled = false;
ctx.imageSmoothingEnabled = false;

const game = new Game(game_canvas.width, game_canvas.height, ctx);

const animate = () => {
  game.update(ctx);
  game.draw(ctx);
  requestAnimationFrame(animate);
};

animate();
