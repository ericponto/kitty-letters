import "phaser";
import { BLOCK_SIZE } from "./constants";
import BaseLevel from "./levels/base-level";
import levels from "./levels/levels";
import GameOver from "./scenes/game-over";
import LevelPicker from "./scenes/level-picker";
import Start from "./scenes/start";
import YouWin from "./scenes/you-win";

const letters = Object.keys(levels);
const levelScenes = letters.map(
  (key, i) =>
    new BaseLevel({
      letter: key,
      map: levels[key],
      nextLevel: letters[i + 1] ? `Level${letters[i + 1]}` : "YouWin"
    })
);

const config = {
  type: Phaser.AUTO,
  parent: "game",
  backgroundColor: "#ccddee",
  width: 16 * BLOCK_SIZE,
  height: 12 * BLOCK_SIZE,
  physics: {
    default: "arcade",
    arcade: {
      gravity: { y: 300 },
      debug: false
    }
  },
  scene: [Start, LevelPicker, ...levelScenes, GameOver, YouWin]
};

const game = new Phaser.Game(config as any);
