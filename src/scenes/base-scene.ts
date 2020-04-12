import "phaser";

export default class BaseScene extends Phaser.Scene {
  preload() {
    this.load.image("sky", "assets/sky.png");
  }

  create() {
    this.add.image(400, 300, "sky");
  }
}
