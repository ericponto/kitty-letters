import "phaser";
import scoreKeeper from "../score";
import BaseScene from "./base-scene";

export default class YouWin extends BaseScene {
  constructor() {
    super("YouWin");
  }

  create() {
    super.create();
    this.add.image(400, 300, "sky");
    this.add.text(270, 300, "You Win!", {
      fontSize: "40px",
      fill: "#222"
    });
    this.add.text(270, 360, `You scored ${scoreKeeper.score} points.`, {
      fontSize: "28px",
      fill: "#222"
    });
  }
}
