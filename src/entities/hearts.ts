import { ImageEntity } from "./base-entity";
import { BLOCK_SIZE } from "../constants";

export default class Hearts extends ImageEntity {
  char = "@";
  key = "heart";
  assetPath = "assets/heart.png";

  createEntity(x, y) {
    const heart = this.group
      .create(
        x * BLOCK_SIZE + BLOCK_SIZE / 2,
        y * BLOCK_SIZE + BLOCK_SIZE / 2,
        this.key
      )
      .setOrigin(0.5, 0.5);

    this.scene.tweens.add({
      targets: heart,
      y: "-=8",
      duration: 800,
      ease: "Sine.easeInOut",
      yoyo: true,
      delay: 400 * Math.random(),
      repeat: -1
    });

    heart.body.setAllowGravity(false);
  }

  postCreate() {
    this.scene.physics.add.overlap(
      this.player,
      this.group,
      this.collectHeart,
      null,
      this
    );
  }

  collectHeart(player, heart) {
    heart.disableBody(true, true);
    this.events.emit("collected");
  }
}
