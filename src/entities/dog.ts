import { SpriteEntity } from "./base-entity";
import { BLOCK_SIZE } from "../constants";

export default class Dog extends SpriteEntity {
  frameWidth = 55;
  frameHeight = 47;
  char = "d";
  key = "dog";
  assetPath = "assets/dog.png";

  createEntity(x, y) {
    const directionMultiplier = x <= 16 * 46 ? 1 : -1;
    const dog = this.group.create(x * BLOCK_SIZE, y * BLOCK_SIZE, "dog");

    dog.setBounce(0.2);
    dog.setCollideWorldBounds(true);
    dog.body.setSize(40, 48);

    dog.setVelocityX(120 * directionMultiplier);
    dog.anims.play(directionMultiplier === 1 ? "right-dog" : "left-dog", true);
    dog.body.onWorldBounds = true;
  }

  createAnims() {
    this.scene.anims.create({
      key: "left-dog",
      frames: this.scene.anims.generateFrameNumbers("dog", {
        start: 0,
        end: 3
      }),
      frameRate: 10,
      repeat: -1
    });

    this.scene.anims.create({
      key: "turn-dog",
      frames: [{ key: "dog", frame: 4 }],
      frameRate: 20
    });

    this.scene.anims.create({
      key: "right-dog",
      frames: this.scene.anims.generateFrameNumbers("dog", {
        start: 5,
        end: 8
      }),
      frameRate: 10,
      repeat: -1
    });
  }

  postCreate() {
    this.scene.physics.world.on("worldbounds", body => {
      this.flipDog(body.gameObject, true);
    });

    this.scene.physics.add.collider(
      this.group,
      this.platforms,
      this.dogPatrol,
      null,
      this
    );

    this.scene.physics.add.overlap(
      this.player,
      this.group,
      this.hitDog,
      null,
      this
    );
  }

  dogPatrol(dog, platform) {
    // if enemy moving to right and has started to move over right edge of platform
    if (
      dog.body.velocity.x > 0 &&
      platform.faceRight &&
      dog.body.right > platform.pixelX + 48
    ) {
      this.flipDog(dog);
    }
    // else if dog moving to left and has started to move over left edge of platform
    else if (
      dog.body.velocity.x < 0 &&
      platform.faceLeft &&
      dog.body.left < platform.pixelX
    ) {
      this.flipDog(dog);
    }
  }

  flipDog(dog, opposite = false) {
    let multiplier = dog.body.velocity.x > 0 ? -1 : 1;
    if (opposite) multiplier *= -1;
    dog.anims.play(multiplier === 1 ? "right-dog" : "left-dog");
    dog.setVelocityX(120 * multiplier);
  }

  hitDog() {
    this.events.emit("hit-dog");
  }
}
