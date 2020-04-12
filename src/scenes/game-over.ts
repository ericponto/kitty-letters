import "phaser";
import BaseScene from "./base-scene";
import { BLOCK_SIZE, FONT_FAMILY } from "../constants";

export default class GameOver extends BaseScene {
  constructor() {
    super("GameOver");
  }

  create() {
    super.create();

    this.add
      .text(BLOCK_SIZE * 8, BLOCK_SIZE * 6, "Game Over", {
        fontFamily: FONT_FAMILY,
        fontSize: "40px",
        fill: "#222"
      })
      .setOrigin(0.5, 0.5);
  }
}
