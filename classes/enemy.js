export class Enemy {
  constructor(game, box, name) {
    this.game = game
    if (game.enemies.length == 1) {
      this.x = game.width / 2 - 50
      this.y = box.y
    }
  }
}

class Sprite {
  constructor(Enemy, spritesheet_path, sprite_index) {
    this.image = new Image()
    this.image.src = spritesheet_path
    this.sprite_index = sprite_index
  }
}
