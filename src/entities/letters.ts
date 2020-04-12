import { ImageEntity } from "./base-entity";
import scoreKeeper from "../score";
import { BLOCK_SIZE } from "../constants";

export default class Letters extends ImageEntity {
  char = "*";
  letter;

  constructor(scene, letter) {
    super(scene);
    this.letter = letter;
    this.key = `letter-${letter}`;
    this.assetPath = `assets/${letter}.png`;
  }

  createEntity(x, y) {
    const letter = this.group
      .create(
        x * BLOCK_SIZE + BLOCK_SIZE / 2,
        y * BLOCK_SIZE + BLOCK_SIZE / 2,
        `letter-${this.letter}`
      )
      .setOrigin(0.5, 0.5);

    this.scene.tweens.add({
      targets: letter,
      y: "-=8",
      duration: 800,
      ease: "Sine.easeInOut",
      yoyo: true,
      delay: 400 * Math.random(),
      repeat: -1
    });

    letter.body.setAllowGravity(false);
  }

  postCreate() {
    this.scene.physics.add.overlap(
      this.player,
      this.group,
      this.collectLetter,
      null,
      this
    );
  }

  collectLetter(player, letter) {
    letter.disableBody(true, true);
    this.events.emit("collected");
  }
}
