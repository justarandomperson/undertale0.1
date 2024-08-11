import { UI } from "../classes/ui.js";

const enemyData = await (await fetch("../data/enemies.json")).json();

let enemy_name;
let data;

let bar = null;

const check = (game) => {
  let dialogue = `* ${enemy_name.toUpperCase()}`;
  Object.keys(data.STATS).forEach((stat) => {
    let value = data.STATS[stat];
    dialogue += `\t${value} ${stat}`;
  });
  dialogue += `\n${data.CHECK}`;
  game.text = "";
  game.dialogue = dialogue;
  game.letterIndex = 0;
};

const pickEnemyAct = (game) => {
  enemy_name = game.enemies[game.playerChoiceY].name;
  data = enemyData[enemy_name];
  game.text = "   ";

  data.ACT.forEach((act) => {
    game.text += `* ${act}\n       `;
  });
};

const fight = (game) => {
  game.player.x = -1000;
  game.playerChoice = -1;
  game.text = "";
  game.plr_attacking = true;

  const fight_ui = new UI(
    {
      game,
      x: game.box.x,
      y: game.box.y,
      width: game.box.width,
      height: game.box.height,
    },
    { src: "../assets/menu/fight.png", name: "fight" }
  );

  bar = new UI(
    {
      game,
      x: game.box.x + 10,
      y: game.box.y + 10,
      width: 7,
      height: game.box.height - 20,
    },
    { backgroundColor: "white", type: "fight_bar" }
  );
  game.ui.unshift(fight_ui);
  game.ui.push(bar);

  game.attack = false;
};

const slash = (game) => {
  const enemy = game.enemies[game.playerChoiceY];
  game.playerTurn = false;
  game.plr_attacking = false;
  game.ui.splice(game.ui.indexOf(bar), 1);
  if (enemy.canDodge) {
    enemy.dodge();
  }
  const target_x = enemy.x + enemy.width / 2;
  const target_y = enemy.y;
  const audio = new Audio("../assets/sound/slash.mp3");
  audio.play();
  setTimeout(() => {
    const slash = new UI(
      {
        game: this,
        x: target_x,
        y: target_y,
        width: 30,
        height: 100,
      },
      {
        src: "../assets/spritesheets/slash.png",
        spritesheet: true,
        scale: 1.8,
      }
    );
    game.ui.push(slash);
  }, 100);
};

const act = (game) => {
  const choice = data.ACT[game.playerChoiceX];
  game.player.y = -1000;
  game.playerChoice = -1;
  if (choice == "Check") {
    check(game);
  }
};

export const btns_func = { pickEnemyAct, fight, slash, act };
