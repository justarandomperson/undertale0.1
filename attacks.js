import { Bullet, types } from "./bullet.js";

export const groundBone = (game, speed) => {
  let x = speed > 0 ? -100 : game.width;
  game.bullets.push(
    new Bullet(
      game,
      x,
      game.height - types["bone"].size.height * 1.35,
      speed,
      "bone",
      90,
      0
    )
  );
};

export const targetBone = (game, speed, rotation = 90, rotation_speed = 0) => {
  let x = speed > 0 ? -100 : game.width;
  game.bullets.push(
    new Bullet(game, x, game.player.y, speed, "bone", rotation, rotation_speed)
  );
};
