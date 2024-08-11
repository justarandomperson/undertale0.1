const buttonsSprites = {
  act: 0,
  fight: 2,
  item: 4,
  mercy: 6,
};

const buttonPositions = {
  fight: 0,
  act: 1,
  item: 2,
  mercy: 3,
};

const src = "../assets/spritesheets/buttons.png";
const scale = 1.7;
const width = 109;
const height = 46.5;

export class Button {
  constructor(game, x, y, name) {
    this.game = game;
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.image = new Image();
    this.image.src = src;
    this.name = name;
    this.sprite = buttonsSprites[name];
  }

  update() {
    if (this.game.playerChoice == buttonPositions[this.name]) {
      this.sprite = buttonsSprites[this.name] + 1;
    } else {
      this.sprite = buttonsSprites[this.name];
    }
  }

  draw(ctx) {
    ctx.drawImage(
      this.image,
      0,
      this.height * this.sprite,
      this.width,
      this.height,
      this.x,
      this.y,
      this.width * scale,
      this.height * scale
    );
  }
}
