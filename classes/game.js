import { Player } from "./player.js";
import { Enemy } from "./enemy.js";
import { UI } from "./ui.js";
import { Button } from "./button.js";
import { InputHandler } from "../input.js";

import { targetBone, groundBone } from "../attacks.js";
import { GasterBlaster } from "./bullet.js";

const box = { width: 1000, height: 200 };
const dialogue = await (await fetch("../data/dialogue.json")).json();

const attacks = [
  [
    {
      name: "groundBone",
      speed: -4,
      delay: 0.2,
    },
    {
      name: "groundBone",
      speed: 4,
      delay: 0,
    },
    {
      name: "gasterblaster",
      delay: 1,
      rotation: 0,
      x: "player",
      y: 380,
    },
    {
      name: "groundBone",
      speed: -4,
      delay: 2,
    },
    {
      name: "groundBone",
      speed: 4,
      delay: 0,
    },
    {
      name: "gasterblaster",
      delay: 1,
      rotation: 0,
      x: "player",
      y: 380,
    },
    {
      name: "groundBone",
      speed: -4,
      delay: 2,
    },
    {
      name: "groundBone",
      speed: 4,
      delay: 0,
    },
    {
      name: "gasterblaster",
      delay: 1,
      rotation: 0,
      x: "player",
      y: 380,
    },
    {
      name: "groundBone",
      speed: -4,
      delay: 2,
    },
    {
      name: "groundBone",
      speed: 4,
      delay: 0,
    },
  ],
];

export class Game {
  constructor(width, height, ctx) {
    this.ctx = ctx;
    this.width = width;
    this.height = height;
    this.bullets = [];
    this.outbullets = [];
    this.effects = [];
    this.input = new InputHandler();
    this.frameCount = 0;
    this.box = new UI(
      {
        width: box.width,
        height: box.height,
        x: this.width / 2 - box.width / 2,
        y: this.height - box.height - 125,
      },
      { borderColor: "white" }
    );
    (this.hp_bar = new UI(
      {
        game: this,
        x: this.width / 2 - 120,
        y: this.box.y + this.box.height + 10,
        width: 270,
        height: 37,
      },
      { type: "bar", maxValue: 100, color: "yellow", backgroundColor: "red" }
    )),
      (this.ui = [
        new UI(
          {
            x: 0,
            y: this.box.y,
            width: this.box.x,
            height: this.box.height,
          },
          { backgroundColor: "black" }
        ),
        new UI(
          {
            x: this.box.x + this.box.width,
            y: this.box.y,
            width: 100,
            height: this.box.height,
          },
          { backgroundColor: "black" }
        ),
      ]);
    this.buttons = [
      new Button(this, this.box.x, this.box.y + this.box.height + 50, "fight"),
      new Button(
        this,
        this.box.x + 260,
        this.box.y + this.box.height + 55,
        "act"
      ),
      new Button(
        this,
        this.box.x + 535,
        this.box.y + this.box.height + 50,
        "item"
      ),
      new Button(
        this,
        this.box.x + 810,
        this.box.y + this.box.height + 45,
        "mercy"
      ),
    ];
    this.enemies = [
      new Enemy(this, "Sans", 1),
      new Enemy(this, "Nagito Komaeda", 0),
    ];
    this.playerTurn = true;
    this.playerChoice = 0;
    this.btnPicked = false;
    this.enemyPicked = false;
    this.turnPicked = false;
    this.dialogue = "* You feel like you're gonna have bad luck.";
    this.letterIndex = 0;
    this.text = "";
    this.turn = 0;
    this.attackEnded = false;
    this.plr_attacking = false;

    this.playerChoiceY = 0;
    this.playerChoiceX = 0;
    this.playerYMax = 0;
    this.playerXMaxes = [];
    this.buttonPressed = null;
    this.dialogueIndex = 0;

    this.player = new Player(this);

    const audio = new Audio("../assets/sound/hope.mp3");
    audio.loop = true;
    audio.play().catch(() => {
      document.addEventListener("keydown", () => {
        audio.play();
      });
    });
  }

  update(ctx) {
    this.player.update(this.input.keys, ctx);
    this.frameCount++;
    if (this.playerTurn) {
      if (this.frameCount > 1 && this.letterIndex < this.dialogue.length) {
        this.frameCount = 0;
        this.text += this.dialogue[this.letterIndex];
        this.letterIndex++;
      }
    }
  }

  draw(ctx) {
    ctx.clearRect(0, 0, this.width, this.height);
    this.buttons.forEach((button) => {
      button.update();
      button.draw(ctx);
    });
    this.player.draw(ctx);
    this.enemies.forEach((enemy) => {
      enemy.update();
      enemy.draw(ctx);
    });
    let alllnull = true;
    this.bullets.forEach((bullet) => {
      if (bullet === null) return;
      bullet.update();
      bullet.draw(ctx);
      alllnull = false;
    });
    this.hp_bar.draw(ctx);
    this.outbullets.forEach((bullet) => {
      if (bullet == null) return;
      alllnull = false;
      bullet.update();
      bullet.draw(ctx);
    });

    this.effects.forEach((effect) => {
      if (effect == null) return;
      alllnull = false;
      effect.update();
      effect.draw(ctx);
    });
    if (alllnull && this.attackEnded && !this.playerTurn) {
      this.start_player_turn();
    }
    this.ui.forEach((ui) => {
      ui.update();
      ui.draw(ctx);
    });
    this.box.draw(ctx);
    ctx.font = "36px pixel";
    ctx.fillStyle = "white";
    ctx.fillText(
      "CHARA   LV 19",
      this.box.x + 20,
      this.box.y + this.box.height + 35
    );
    ctx.font = "30px pixel";
    ctx.fillText("HP", this.hp_bar.x - 50, this.box.y + this.box.height + 35);
    ctx.fillText(
      "KR",
      this.hp_bar.x + this.hp_bar.maxWidth + 10,
      this.box.y + this.box.height + 35
    );

    ctx.fillText(
      `${Math.round(this.player.HP)} / ${this.player.maxHP}`,
      this.hp_bar.x + 350,
      this.box.y + this.box.height + 35
    );
    ctx.font = "34px pixel";
    let text_y = this.box.y + 50;
    this.text.split("\n").forEach((line) => {
      ctx.fillText(line, this.box.x + 20, text_y);
      text_y += 40;
    });

    this.player.checkCollision([...this.bullets, ...this.outbullets]);
  }

  turn_end_dialogue() {
    this.playerTurn = false;
    this.text = "";
    const dialogueturn = dialogue[this.turn]
      ? dialogue[this.turn][this.dialogueIndex]
      : null;
    if (dialogueturn) {
      if (dialogueturn.sprite) {
        dialogueturn.sprite.forEach((spritechange) => {
          this.enemies[dialogueturn.speaker].spriteChange(spritechange);
        });
      }
      this.enemies[dialogueturn.speaker].talk(dialogueturn.text);
      const z = (e) => {
        if (e.key.toLowerCase() == "z") {
          document.removeEventListener("keypress", z);
          this.enemies[dialogueturn.speaker].speech_bubble = null;
          this.dialogueIndex++;
          this.turn_end_dialogue();
        }
      };
      document.addEventListener("keypress", z);
    } else {
      this.end_player_turn();
    }
  }

  end_player_turn() {
    this.attackEnded = false;
    this.letterIndex = 0;
    this.frameCount = 0;
    this.enemyPicked = false;
    this.btnPicked = false;
    this.turnPicked = false;
    this.playerChoiceY = 0;
    this.playerChoiceX = 0;
    this.player.yvel = 0;

    this.player.x = this.box.x + this.box.width / 2 - this.player.width / 2;
    this.player.y = this.box.y + this.box.height / 2 - this.player.height;
    this.turn++;

    this.create_bullet(0);
  }

  start_player_turn() {
    this.playerTurn = true;
    this.text = "";
    this.letterIndex = 0;
    this.frameCount = 0;
    this.dialogue = "* You feel like you're gonna have bad luck.";
    this.playerChoice = 0;
    this.player.updatePlayerChoice(0);
    this.player.y = this.box.y + this.box.height + this.player.height + 37;

    this.bullets = [];
    this.outbullets = [];
    this.effects = [];
  }

  create_bullet(index) {
    const attack = attacks[this.turn - 1] || attacks[attacks.length - 1];
    const bullet = attack[index];
    if (index == attack.length) {
      this.attackEnded = true;
      return;
    }
    setTimeout(() => {
      if (bullet.name == "targetBone") {
        targetBone(this, 1, bullet.speed, 0, 5);
      }
      if (bullet.name == "groundBone") {
        groundBone(this, 1, bullet.speed);
      }
      if (bullet.name == "gasterblaster") {
        const blaster = new GasterBlaster(
          this,
          bullet.x == "player"
            ? this.player.x - this.player.width / 2
            : bullet.x,
          bullet.y == "player"
            ? this.player.y - this.player.height / 2
            : bullet.y,
          0.5,
          bullet.rotation
        );
        this.effects.push(blaster);
      }
      this.create_bullet(index + 1);
    }, bullet.delay * 1000);
  }
}
