import { Bullet, types } from "./classes/bullet.js"

export const groundBone = (game, damage, speed) => {
  let x = speed > 0 ? -100 : game.width
  game.bullets.push(
    new Bullet(game, x, "bottom", speed, "bone", damage, true, 90, 0)
  )
}

export const targetBone = (
  game,
  damage,
  speed,
  rotation = 90,
  rotation_speed = 0
) => {
  let x = speed > 0 ? -100 : game.width
  game.bullets.push(
    new Bullet(
      game,
      x,
      game.player.y,
      speed,
      "bone",
      damage,
      true,
      rotation,
      rotation_speed
    )
  )
}
