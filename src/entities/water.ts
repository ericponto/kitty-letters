import { ImageEntity } from "./base-entity";

export default class Water extends ImageEntity {
  char: string = "~";
  key: string = "water";
  assetPath: string = "assets/water.png";
  static: boolean = true;

  createEntity(x, y) {
    const water = this.group
      .create(x * 48 + 24, y * 48 + 36, this.key)
      .setSize(48, 36)
      .setOrigin(0.5, 0.67)
      .setAlpha(0.9);

    this.scene.tweens.add({
      targets: water,
      alpha: {
        getStart: () => 0.9,
        getEnd: () => 0.6
      },
      duration: 2000,
      ease: "Sine.easeInOut",
      yoyo: true,
      delay: Math.random() * 1000,
      repeat: -1
    });
  }

  postCreate() {
    this.scene.physics.add.collider(
      this.player,
      this.group,
      this.hitWater,
      null,
      this
    );
  }

  hitWater() {
    this.events.emit("hit-water");
  }
}
