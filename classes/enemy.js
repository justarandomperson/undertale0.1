import { UI } from "./ui.js";
import { bounce_animation } from "../util/sprite_animations.js";

const enemies = {
  Sans: {
    spritesheet_path: "../assets/spritesheets/sans.png",
    scale: 3.5,
    dodge: true,
    parts: {
      torso: {
        sx: 17,
        sy: 0,
        width: 71.5,
        height: 70,
        sprite_index: 0,
        max_sprites: 8,
        offsetx: -55,
        offsety: 3,
        animation_data: { distance: 2, speedx: 0.2, speedy: 0.5, delay: 1.5 },
        moveAnimation: bounce_animation,
      },
      pants: {
        sx: 16,
        sy: 74,
        width: 50,
        height: 24,
        sprite_index: 0,
        max_sprites: 1,
        offsetx: -15,
        offsety: 145,
      },
      head: {
        sx: 16,
        sy: 500,
        width: 37,
        height: 45,
        sprite_index: 0,
        max_sprites: 8,
        offsetx: 0,
        offsety: -70,
        animation_data: { distance: 2, speedx: 0.2, speedy: 0.7, delay: 1.5 },
        moveAnimation: bounce_animation,
      },
    },
    speech: "right",
    talk: "../assets/sound/sans.mp3",
    volume: 1,
  },
  "Nagito Komaeda": {
    image_path: "../assets/other/nagito_komaeda.jpg",
    scale: 0.9,
    parts: {
      torso: {
        height: 500,
        width: 250,
      },
    },
    speech: "left",
    talk: "../assets/sound/nagito.mp3",
    volume: 0.3,
  },
};

export class Enemy {
  constructor(game, name, enemyindex = null) {
    this.game = game;
    this.name = name;
    this.x = game.box.width / 2 + 100 + enemyindex * 300;
    this.y =
      game.box.y - game.box.height - enemies[name].parts.torso.height / 2 - 10;
    this.width = 0;
    this.ogx = this.x;
    this.ogy = this.y;
    this.canDodge = enemies[name].dodge || false;
    this.dodging = false;
    this.parts = {};
    this.xvel = 0;
    this.scale = enemies[name].scale;
    this.dialogue = "";
    this.frameCount = 0;
    this.text_index = 0;
    const sprite_data = enemies[name];
    this.speech_bubble = null;

    if (sprite_data.spritesheet_path) {
      this.height = sprite_data.parts.torso.height * this.scale;
      for (const part in sprite_data.parts) {
        const data = sprite_data.parts[part];
        this.parts[part] = new Sprite(
          this,
          sprite_data.spritesheet_path,
          sprite_data.parts[part],
          sprite_data.scale
        );
        if (data.width > this.width) {
          this.width = data.width;
        }
      }
    } else {
      this.image = new Image();
      this.image.src = sprite_data.image_path;
      this.width = enemies[name].parts.torso.width * this.scale;
      this.height = enemies[name].parts.torso.height;
    }
  }
  update() {
    if (this.dodging) {
      if (this.name == "Sans") {
        if (this.parts.head.sprite_index == 0) {
          const random_heads = [1, 3, 4, 5];
          this.parts.head.sprite_index =
            random_heads[Math.floor(Math.random() * random_heads.length)];
          this.parts.torso.sprite_index = 1;
        }
      }
      this.xvel += 2;
      if (this.xvel >= 6) {
        this.dodging = false;
        const missEffect = new UI(
          {
            game: this.game,
            x: this.ogx,
            y: this.ogy - 70,
            width: 118,
            height: 30,
          },
          { src: "../assets/effects/miss.png", scale: 1.2, name: "miss" }
        );
        this.game.ui.push(missEffect);
      }
    } else if (this.x > this.ogx) {
      this.xvel -= 0.1;
    } else {
      if (this.xvel != 0) {
        this.xvel = 0;
        this.parts.torso.sprite_index = 0;
        this.parts.head.sprite_index = 0;
        this.x = this.ogx;
        this.game.ui.splice(
          this.game.ui.indexOf(this.game.ui.find((ui) => ui.name == "miss")),
          1
        );
        this.game.ui.splice(
          this.game.ui.indexOf(this.game.ui.find((ui) => ui.name == "fight")),
          1
        );
        this.game.turn_end_dialogue();
      }
    }
    this.x += this.xvel;
    Object.entries(this.parts).forEach((part) => {
      part[1].x += this.xvel;
    });
  }

  talk = (text) => {
    this.text = "";
    this.dialogue = text;
    const direction = enemies[this.name].speech;
    const x_offset = direction == "left" ? -340 : 160;
    const y_offset = direction == "left" ? 20 : -40;
    this.speech_bubble = new UI(
      {
        game: this.game,
        x: this.x + x_offset,
        y: this.y + y_offset,
        width: 280,
        height: 140,
      },
      { src: `../assets/other/speechbubble_${direction}.png`, scale: 1.3 }
    );
  };
  draw(ctx) {
    this.frameCount++;
    if (this.image) {
      ctx.drawImage(
        this.image,
        this.x,
        this.y,
        enemies[this.name].parts.torso.width * this.scale,
        enemies[this.name].parts.torso.height * this.scale
      );
    } else {
      Object.entries(this.parts).forEach((part) => {
        part[1].update(ctx);
        part[1].draw(ctx);
      });
    }
    if (this.speech_bubble) {
      this.speech_bubble.draw(ctx);
      if (this.text.length < this.dialogue.length && this.frameCount > 2) {
        const audio = new Audio(enemies[this.name].talk);
        audio.volume = enemies[this.name].volume;
        audio.play();
        this.text += this.dialogue[this.text.length];
        this.frameCount = 0;
      }
      const direction = enemies[this.name].speech;
      const x_offset = direction == "left" ? 20 : 60;
      ctx.font = "24px pixel";
      ctx.fillStyle = "black";
      const text = this.text.split("\n");
      text.forEach((line, index) => {
        ctx.fillText(
          line,
          this.speech_bubble.x + x_offset,
          this.speech_bubble.y + 40 + index * 30
        );
      });
    }
  }

  spriteChange(name) {
    switch (name) {
      case "sad":
        this.parts.head.sprite_index = 2;
        break;
      case "wink":
        this.parts.head.sprite_index = 3;
        break;
      case "shrug":
        this.parts.torso.sprite_index = 1;
        break;
    }
  }
  dodge() {
    this.dodging = true;
  }
}

class Sprite {
  constructor(Enemy, spritesheet_path, sprite_data, scale, spritesheet = true) {
    this.enemy = Enemy;
    this.image = new Image();
    this.image.src = spritesheet_path;
    this.sprite_index = sprite_data.sprite_index;
    this.max_sprites = sprite_data.max_sprites;
    this.offsetx = sprite_data.offsetx;
    this.offsety = sprite_data.offsety;
    this.x = Enemy.x + sprite_data.offsetx;
    this.y = Enemy.y + sprite_data.offsety;
    this.sx = sprite_data.sx;
    this.sy = sprite_data.sy;
    this.width = sprite_data.width;
    this.height = sprite_data.height;
    this.scale = scale;
    this.isSpritesheet = spritesheet;
    this.frameCount = 0;
    this.animation_data = sprite_data.animation_data;
    this.moveAnimation = sprite_data.moveAnimation;
  }

  update(ctx) {
    if (this.moveAnimation) {
      this.moveAnimation(this, this.animation_data);
    }
  }

  draw(ctx) {
    if (this.isSpritesheet) {
      ctx.drawImage(
        this.image,
        this.sx + this.width * this.sprite_index,
        this.sy,
        this.width,
        this.height,
        this.x,
        this.y,
        this.width * this.scale,
        this.height * this.scale
      );
    } else {
      ctx.drawImage(this.image, this.x, this.y, this.width, this.height);
    }
  }
}
