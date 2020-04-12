import "phaser";
import BaseScene from "./base-scene";

export default class Start extends BaseScene {
  constructor() {
    super("Start");
  }

  preload() {
    super.preload();
    this.load.image("big-cat", "assets/big-cat.png");
    this.load.image("play", "assets/play.png");
  }

  create() {
    super.create();
    this.add.image(48, 48, "big-cat").setOrigin(0.15, 0.1);
    this.add
      .image(48 * 8, 48 * 11, "play")
      .setInteractive()
      .on("pointerdown", () => {
        this.scene.start("LevelPicker");
      });

    this.add.text(48 * 8, 48 * 4, "Kitty Letters", {
      fontFamily: "Gloria Hallelujah",
      fontSize: "40px",
      fill: "#224449"
    });
  }
}
