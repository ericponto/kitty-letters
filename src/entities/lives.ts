import BaseLevel from "../levels/base-level";
import { Entity } from "./base-entity";
import { BLOCK_SIZE } from "../constants";

let lives: number = 9;

export default class Lives extends Entity {
  key: string = "lives";
  assetPath: string = "assets/heart.png";
  scene: BaseLevel;
  text: Phaser.GameObjects.Text;

  preload() {
    this.scene.load.image(this.key, this.assetPath);
  }

  create() {
    this.scene.add.image(14 * BLOCK_SIZE + 32, 24, this.key);
    this.text = this.scene.add.text(15 * BLOCK_SIZE, 18, String(lives));
  }

  createEntity() {}

  removeLife() {
    lives -= 1;
    this.text.setText(String(lives));
    if (lives < 1) {
      this.events.emit("game-over");
    }
  }

  addLife() {
    lives += 1;
    this.text.setText(String(lives));
  }
}
