export class Game {
  constructor(width, height) {
    this.width = width
    this.height = height
    this.enemies = []
    this.bullets = []
    this.outbullets = []
    this.effects = []
    this.playerTurn = true
    this.input = new InputHandler()
    ;(this.hp_bar = new UI(
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
      ))
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
    ]
    this.player = new Player(this)
  }

  update() {
    this.player.update(this.input.keys)
  }
  draw(ctx) {
    ctx.clearRect(0, 0, this.width, this.height)
    this.player.draw(ctx)
    this.bullets.forEach((bullet) => {
      if (bullet === null) return
      bullet.update()
      bullet.draw(ctx)
    })
    this.mask.forEach((mask) => {
      mask.draw(ctx)
    })
    this.outbullets.forEach((bullet) => {
      if (bullet == null) return
      bullet.update()
      bullet.draw(ctx)
    })
    this.effects.forEach((effect) => {
      if (effect == null) return
      effect.update()
      effect.draw(ctx)
    })
    this.box.draw(ctx)
    this.player.checkCollision([...this.bullets, ...this.outbullets])
    this.hp_bar.draw(ctx)
  }
}
