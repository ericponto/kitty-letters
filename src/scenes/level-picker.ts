import "phaser";
import BaseScene from "./base-scene";
import { FONT_FAMILY } from "../constants";

const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";

export default class LevelPicker extends BaseScene {
  availableLevels: Array<string>;

  constructor() {
    super("LevelPicker");
  }

  init() {
    this.availableLevels = (
      window.localStorage.getItem("availableLevels") || "A"
    ).split("");
  }

  preload() {
    super.preload();
    this.load.image("badge", "assets/badge.png");
  }

  create() {
    super.create();
    this.add.image(400, 300, "sky");
    this.add
      .text(48 * 8, 48, "Pick a level", {
        fontFamily: FONT_FAMILY,
        fontSize: "24px",
        fill: "#fff"
      })
      .setOrigin(0.5, 0.5);

    const letterArray = letters.split("");
    const letterGroup = this.physics.add.group({
      allowGravity: false
    });

    for (let i = 0; i < 5; i++) {
      for (let j = 0; j < 6; j++) {
        const int = i * 6 + j;
        if (int < 26) {
          const currentLetter = letterArray[int];
          const letterObj = letterGroup
            .create(144 + j * 96, 120 + i * 96, "badge")
            .setScale(3)
            .setInteractive()
            .setDataEnabled();

          if (this.availableLevels.includes(currentLetter)) {
            letterObj.on("pointerdown", () => {
              this.scene.start(`Level${currentLetter}`);
            });

            letterObj.on("pointerover", () => {
              letterObj.setTint(0xffffff);
            });
          } else {
            letterObj.setTint(0x999999);
          }

          this.add
            .text(144 + j * 96, 120 + i * 96, currentLetter, {
              fontSize: "20px",
              fill: "#222"
            })
            .setOrigin(0.5, 0.5);
        }
      }
    }
  }
}
