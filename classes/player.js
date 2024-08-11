import { detectRectangleCollision } from "../collision.js";
import { btns_func } from "../util/buttons_func.js";

//cant fix the buttons sprites right now so this is a lazy workaround
const buttonOffsets = {
  0: -1,
  1: -4,
  2: 2,
  3: 10,
};

export class Player {
  constructor(game) {
    this.game = game;
    this.width = 35;
    this.height = 35;
    this.speed = 3;
    this.scale = 2;
    this.rotation = 0;
    this.image = new Image();
    this.mode = "blue";
    this.image.src = `assets/other/${this.mode}_soul.png`;

    this.items = [
      "Pie",
      "I. Noodles",
      "Steak",
      "L. Hero",
      "L. Hero",
      "L. Hero",
      "L. Hero",
      "L. Hero",
    ];
    this.HP = 92;
    this.maxHP = 92;
    this.grounded = false;
    this.yvel = 0;

    this.buttonPressed = "";
    this.playerXMax = 0;

    this.game.hp_bar.update({
      maxValue: 100,
      value: (this.HP / this.maxHP) * 100,
    });
    if (this.game.playerTurn) {
      this.x = game.box.x + this.width;
      this.y = game.box.y + game.box.height + this.height + 37;
    } else {
      this.x = game.box.x + game.box.width / 2 - this.width / 2;
      this.y = game.box.y + game.box.height / 2 - this.height;
    }
  }

  update(input) {
    this.image.src = `assets/other/${this.mode}_soul.png`;
    let button_pressed = this.game.input.keys[this.game.input.keys.length - 1];
    if (this.game.playerTurn) {
      if (button_pressed == this.buttonPressed) return;
      this.buttonPressed = button_pressed;
      if (!this.game.btnPicked) {
        this.updatePlayerChoice(0);
        if (!button_pressed) return;
        this.menu_movement(button_pressed);
      } else {
        if (!button_pressed) return;
        this.menu_picked_movement(button_pressed);
      }
      return;
    }
    if (this.mode == "red") {
      this.red_movementinput;
    }
    if (this.mode == "blue") {
      this.blue_movement(input);
    }
    if (input.includes("ArrowRight") || input.includes("d")) {
      if (this.x < this.game.box.x + this.game.box.width - this.width)
        this.x += this.speed;
    }
    if (input.includes("ArrowLeft") || input.includes("a")) {
      if (this.x > this.game.box.x) this.x -= this.speed;
    }
  }
  draw(ctx) {
    ctx.drawImage(this.image, this.x, this.y, this.width, this.height);
  }

  red_movement(input) {
    if (input.includes("ArrowUp") || input.includes("w")) {
      if (this.y > this.game.box.y) this.y -= this.speed;
    }
    if (input.includes("ArrowDown") || input.includes("s")) {
      if (this.y < this.game.box.y + this.game.box.height - this.height)
        this.y += this.speed;
    }
  }

  blue_movement(input) {
    this.y += this.yvel;
    if (!this.grounded) {
      if (this.y > this.game.box.y + this.game.box.height - this.height) {
        this.y = this.game.box.y + this.game.box.height - this.height;
        this.grounded = true;
        this.yvel = 0;
      } else {
        if (this.yvel < 3) this.yvel += 0.5;
      }

      return;
    }
    if (
      !input.includes("ArrowUp") ||
      this.y < this.game.box.y + this.game.box.height - 100
    ) {
      this.grounded = false;
    }
    if (input.includes("ArrowUp") || input.includes("w")) {
      if (this.y < this.game.box.y + this.game.box.height - 100) return;
      if (this.yvel == 0) {
        this.yvel = -4;
      }
      if (this.y > this.game.box.y) {
        this.yvel -= 0.2;
      }
    }
  }

  checkCollision(bullets) {
    bullets.forEach((bullet) => {
      if (bullet === null) return;

      let bulletWidth = bullet.hitbox
        ? bullet.hitbox.width
        : bullet.width * bullet.scale;
      let bulletHeight = bullet.hitbox
        ? bullet.hitbox.height
        : bullet.height * bullet.scale;

      if (
        detectRectangleCollision(
          {
            x: this.x,
            y: this.y,
            width: this.width,
            height: this.height,
            currRotation: this.rotation,
          },
          {
            x: bullet.x,
            y: bullet.y,
            width: bulletWidth,
            height: bulletHeight,
            currRotation: bullet.rotation,
          }
        ) &&
        Date.now() - bullet.lastHit > bullet.cooldown
      ) {
        const damage = bullet.damage;
        bullet.lastHit = Date.now();
        this.HP -= damage;
        this.game.hp_bar.update({
          value: (this.HP / this.maxHP) * 100,
        });
      }
    });
  }

  changeOptionY() {
    if (this.game.playerChoice == 2) {
      this.playerXMax = this.game.playerXMaxes[this.game.playerChoiceY];
      this.x = this.game.box.x + this.width;
      this.game.playerChoiceX = 0;
    }
  }
  updatePlayerChoice(move) {
    this.game.playerChoice += move;
    this.x =
      this.game.box.x +
      this.width / 2 -
      6 +
      this.game.playerChoice * 265 +
      buttonOffsets[this.game.playerChoice];
  }

  menu_movement(button_pressed) {
    if (button_pressed == "ArrowRight") {
      if (this.game.playerChoice < 3) this.updatePlayerChoice(1);
    }
    if (button_pressed == "ArrowLeft") {
      if (this.game.playerChoice > 0) this.updatePlayerChoice(-1);
    }
    if (button_pressed.toLowerCase() == "z") {
      this.buttonPicked();
    }
  }

  menu_picked_movement(button_pressed, game, player) {
    if (button_pressed.toLowerCase() == "z") {
      if (this.game.plr_attacking) btns_func.slash(this.game);
      if (this.game.enemyPicked && !this.game.turnPicked) {
        switch (this.game.playerChoice) {
          case 1:
            btns_func.act(this.game);
            break;
          case 2:
            break;
          case 3:
            break;
        }

        this.game.turnPicked = true;
        return;
      } else if (
        this.game.turnPicked &&
        this.game.letterIndex == this.game.dialogue.length
      ) {
        this.game.turn_end_dialogue();
      }
      this.game.enemyPicked = true;
      switch (this.game.playerChoice) {
        case 0:
          btns_func.fight(this.game);
          break;
        case 1:
          this.y = this.game.box.y + 20;
          btns_func.pickEnemyAct(this.game);
          break;
        default:
          this.game.enemyPicked = false;
          break;
      }
    }
    if (button_pressed == "ArrowUp") {
      if (this.game.playerChoiceY > 0) {
        this.y -= 40;
        this.game.playerChoiceY -= 1;
        this.changeOptionY();
      }
    }
    if (button_pressed == "ArrowDown") {
      if (this.game.playerChoiceY < this.game.playerYMax) {
        this.y += 40;
        this.game.playerChoiceY += 1;
        this.changeOptionY();
      }
    }
    if (button_pressed == "ArrowRight") {
      if (
        this.game.playerChoiceX <
        this.game.playerXMaxes[this.game.playerChoiceY] - 1
      ) {
        this.x +=
          this.game.ctx.measureText(
            this.items[this.game.playerChoiceX + this.game.playerChoiceY * 5]
          ).width + 90;
        this.game.playerChoiceX += 1;
      }
    }
    if (button_pressed == "ArrowLeft") {
      if (this.game.playerChoiceX > 0) {
        this.x -=
          this.game.ctx.measureText(
            this.items[
              this.game.playerChoiceX + this.game.playerChoiceY * 5 - 1
            ]
          ).width + 90;
        this.game.playerChoiceX -= 1;
      }
    }
    if (button_pressed.toLowerCase() == "x") {
      if (this.game.plr_attacking) return;
      if (this.game.turnPicked) {
        this.game.text = this.game.dialogue;
        this.game.letterIndex = this.game.dialogue.length;
        return;
      }
      if (this.game.enemyPicked) {
        this.game.enemyPicked = false;
        this.buttonPicked(true);
        return;
      }
      this.y = this.game.box.y + this.game.box.height + this.height + 37;
      this.updatePlayerChoice(0);
      this.game.btnPicked = false;
      this.game.text = "";
      this.game.letterIndex = 0;
    }
  }

  buttonPicked(cancel) {
    this.game.playerChoiceX = 0;
    this.game.playerChoiceY = 0;
    this.game.playerYMax = 0;
    this.game.playerXMax = 0;
    this.game.btnPicked = true;
    this.x = this.game.box.x + this.width;
    this.y = this.game.box.y + 20;
    if (!cancel) {
      this.game.playerChoiceX = 0;
      this.game.playerChoiceY = 0;
      this.game.playerYMax = 0;
      this.game.playerXMax = 0;
      this.x = this.game.box.x + this.width;
      this.y = this.game.box.y + 20;
    } else {
      this.y = this.game.box.y + 20 + this.game.playerChoiceY * 40;
    }
    this.game.letterIndex = 100000;
    this.game.text = "   ";

    if (this.game.playerChoice == 0 || this.game.playerChoice == 1) {
      this.game.playerYMax = this.game.enemies.length - 1;
      this.game.enemies.forEach((enemy) => {
        this.game.text += `* ${enemy.name}\n   `;
      });
    } else if (this.game.playerChoice == 2) {
      this.game.playerXMaxes.push(0);
      let x = 0;
      let y = 0;
      this.items.forEach((item) => {
        if (x < 5) {
          this.game.text += `* ${item}        `;
          this.game.playerXMaxes[y] += 1;
          x += 1;
          if (x == 5) {
            this.game.playerYMax += 1;
          }
        } else {
          this.game.text += `\n        `;
          this.game.playerXMaxes.push(0);
          x = 0;
          y++;
        }
      });
    } else {
      this.game.text += "* Spare";
    }
  }
}
