export const bounce_animation = (sprite, animation_data) => {
  const { delay, speedx, speedy, distance } = animation_data;
  sprite.frameCount += 0.5;
  const ogx = sprite.enemy.x + sprite.offsetx;
  const ogy = sprite.enemy.y + sprite.offsety;
  if (!sprite.hasOwnProperty("state")) {
    sprite.state = 0;
  }
  if (sprite.frameCount < delay) return;
  sprite.frameCount = 0;
  if (sprite.state == 0) {
    sprite.x += speedx;
    sprite.y -= speedy;
    if (sprite.x >= ogx + distance) sprite.state = 1;
  }
  if (sprite.state == 1) {
    sprite.x -= speedx;
    sprite.y += speedy;
    if (sprite.x <= ogx) sprite.state = 2;
  }
  if (sprite.state == 2) {
    sprite.x -= speedx;
    sprite.y -= speedy;
    if (sprite.x <= ogx - distance) {
      sprite.state = 3;
    }
  }

  if (sprite.state == 3) {
    sprite.x += speedx;
    sprite.y += speedy;
    if (sprite.x >= ogx) {
      sprite.x = ogx;
      sprite.y = ogy;
      sprite.state = 0;
    }
  }
};
