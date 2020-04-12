import { SpriteEntity } from "./base-entity";
import { BLOCK_SIZE } from "../constants";

export default class Player extends SpriteEntity {
  frameWidth = 55;
  frameHeight = 47;
  char = "c";
  key = "cat";
  assetPath = "assets/cat-sprite.png";
  player;
  cursors;
  startPosition: { x: number; y: number };
  isHit: boolean = false;

  preload() {
    super.preload();
    this.scene.load.spritesheet("cat-other", "assets/cat-other.png", {
      frameWidth: 53,
      frameHeight: 48
    });
  }

  create({ map, platforms }) {
    this.map = map;
    this.platforms = platforms;

    this.createAnims();

    for (let i = 0; i < 12; i++) {
      for (let j = 0; j < 16; j++) {
        if (this.map[i][j] === this.char) {
          this.createEntity(j, i);
        }
      }
    }

    this.postCreate();
  }

  createEntity(x, y) {
    this.startPosition = { x: x * BLOCK_SIZE, y: y * BLOCK_SIZE };
    this.player = this.scene.physics.add.sprite(
      x * BLOCK_SIZE,
      y * BLOCK_SIZE,
      "cat"
    );

    this.player.setCollideWorldBounds(true);

    this.player.body.setSize(40, 48);
  }

  createAnims() {
    this.scene.anims.create({
      key: "left",
      frames: this.scene.anims.generateFrameNumbers("cat", {
        start: 0,
        end: 3
      }),
      frameRate: 10,
      repeat: -1
    });

    this.scene.anims.create({
      key: "turn",
      frames: [{ key: "cat", frame: 4 }],
      frameRate: 20
    });

    this.scene.anims.create({
      key: "right",
      frames: this.scene.anims.generateFrameNumbers("cat", {
        start: 5,
        end: 8
      }),
      frameRate: 10,
      repeat: -1
    });

    this.scene.anims.create({
      key: "hit",
      frames: [{ key: "cat-other", frame: 0 }],
      frameRate: 20
    });
    this.scene.anims.create({
      key: "jump-right",
      frames: [{ key: "cat-other", frame: 1 }],
      frameRate: 20
    });
    this.scene.anims.create({
      key: "jump-left",
      frames: [{ key: "cat-other", frame: 2 }],
      frameRate: 20
    });
  }

  postCreate() {
    this.scene.physics.add.collider(this.player, this.platforms);
    this.cursors = this.scene.input.keyboard.createCursorKeys();
  }

  update() {
    if (this.isHit) {
      this.player.anims.play("hit");
    } else {
      if (this.player.body.touching.down || this.player.body.blocked.down) {
        if (this.cursors.left.isDown) {
          this.player.setVelocityX(-160);

          this.player.anims.play("left", true);
        } else if (this.cursors.right.isDown) {
          this.player.setVelocityX(160);

          this.player.anims.play("right", true);
        } else {
          this.player.setVelocityX(0);

          this.player.anims.play("turn");
        }

        if (this.cursors.up.isDown) {
          this.player.setVelocityY(-330);
        }
      } else {
        if (this.cursors.left.isDown) {
          this.player.setVelocityX(-160);

          this.player.anims.play("jump-left", true);
        } else if (this.cursors.right.isDown) {
          this.player.setVelocityX(160);

          this.player.anims.play("jump-right", true);
        } else {
          this.player.setVelocityX(0);
          if (
            this.player.anims.currentFrame &&
            this.player.anims.currentFrame.textureKey === "cat"
          ) {
            const { index } = this.player.anims.currentFrame;
            if (index < 5) {
              this.player.anims.play("jump-left", true);
            } else {
              this.player.anims.play("jump-right", true);
            }
          }
        }
        if (this.cursors.down.isDown) {
          this.player.setVelocityY(this.player.body.velocity.y + 10);
        }
      }
    }
  }

  hit() {
    this.scene.physics.pause();
    this.isHit = true;

    setTimeout(() => {
      this.player.setPosition(this.startPosition.x, this.startPosition.y);
      this.isHit = false;
      this.scene.physics.resume();
    }, 500);
  }
}
