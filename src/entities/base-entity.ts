import { Scene } from "phaser";

export abstract class Entity {
  scene: Scene;
  map: Array<Array<string>>;
  char: string;
  key: string;
  assetPath: string;
  group;
  player;
  platforms;
  events = new Phaser.Events.EventEmitter();

  constructor(scene) {
    this.scene = scene;
  }

  abstract preload(): void;
  abstract create({ player, map, platforms }): void;
  abstract createEntity(x: number, y: number): void;
  update() {}
}

export abstract class SpriteEntity extends Entity {
  frameWidth: number;
  frameHeight: number;

  preload() {
    this.scene.load.spritesheet(this.key, this.assetPath, {
      frameWidth: this.frameWidth,
      frameHeight: this.frameHeight
    });
  }

  create({ player, map, platforms }) {
    this.player = player;
    this.map = map;
    this.platforms = platforms;

    this.createAnims();
    this.group = this.scene.physics.add.group();

    for (let i = 0; i < 12; i++) {
      for (let j = 0; j < 16; j++) {
        if (this.map[i][j] === this.char) {
          this.createEntity(j, i);
        }
      }
    }

    this.postCreate();
  }

  abstract createAnims(): void;
  postCreate() {}
}

export abstract class ImageEntity extends Entity {
  static: boolean = false;

  preload() {
    this.scene.load.image(this.key, this.assetPath);
  }

  create({ player, map, platforms }) {
    this.player = player;
    this.map = map;
    this.platforms = platforms;
    this.group = this.scene.physics.add[
      this.static ? "staticGroup" : "group"
    ]();

    for (let i = 0; i < 12; i++) {
      for (let j = 0; j < 16; j++) {
        if (this.map[i][j] === this.char) {
          this.createEntity(j, i);
        }
      }
    }

    this.postCreate();
  }

  postCreate() {}
}
