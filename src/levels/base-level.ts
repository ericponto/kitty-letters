import "phaser";
import scoreKeeper from "../score";
import Dog from "../entities/dog";
import Player from "../entities/player";
import Letters from "../entities/letters";
import Lives from "../entities/lives";
import Water from "../entities/water";
import Hearts from "../entities/hearts";
import { BLOCK_SIZE, FONT_FAMILY } from "../constants";
export interface LevelConfig {
  letter: string;
  nextLevel: string;
  map: string;
}

export default class BaseLevel extends Phaser.Scene {
  letter: string;
  letters;
  scoreText;
  levelText;
  config: LevelConfig;
  map;
  platforms;
  levelMap: Array<string[]>;
  entities: any = {};
  playerEntity;
  lives: Lives;

  constructor(config: LevelConfig) {
    super(`Level${config.letter}`);
    this.letter = config.letter;
    this.config = config;
  }

  init() {
    this.initMap();
    this.levelAchieved();
    this.playerEntity = new Player(this);
    this.addEntity("dog", Dog);
    this.addEntity("letters", Letters, this.letter);
    this.addEntity("hearts", Hearts);
    this.addEntity("lives", Lives);
    this.addEntity("water", Water);

    this.entities.letters.events.on("collected", () => {
      this.updateScore();
    });

    this.entities.hearts.events.on("collected", () => {
      this.addLife();
    });

    this.entities.dog.events.on("hit-dog", () => {
      this.playerHit();
    });

    this.entities.water.events.on("hit-water", () => {
      this.playerHit();
    });

    this.entities.lives.events.on("game-over", () => {
      this.scene.start("GameOver");
    });
  }

  preload() {
    this.load.image("sky", "assets/sky.png");
    this.load.image("tiles", "assets/tileset.png");

    this.playerEntity.preload();
    this.forEntities(entity => entity.preload());
  }

  create() {
    this.add.image(400, 300, "sky");
    this.createTileMap();
    this.createScoreText();
    this.createLevelText();

    this.playerEntity.create({
      map: this.levelMap,
      platforms: this.platforms
    });
    const player = this.playerEntity.player;

    this.forEntities(entity =>
      entity.create({
        player,
        map: this.levelMap,
        platforms: this.platforms
      })
    );
  }

  update() {
    this.playerEntity.update();
    this.forEntities(entity => entity.update());
  }

  levelAchieved() {
    const availableLevelsArr = (
      window.localStorage.getItem("availableLevels") || ""
    ).split("");

    if (availableLevelsArr.indexOf(this.letter) === -1) {
      availableLevelsArr.push(this.letter);
    }

    window.localStorage.setItem("availableLevels", availableLevelsArr.join(""));
  }

  addEntity(key: string, Entity, ...args) {
    this.entities[key] = new Entity(this, ...args);
  }

  forEntities(fn) {
    for (let entity in this.entities) {
      fn(this.entities[entity]);
    }
  }

  initMap() {
    this.levelMap = this.config.map
      .split("\n")
      .filter(x => !!x)
      .map(row => row.split(""));
  }

  createTileMap() {
    const level = this.levelMap.map(row =>
      row.map(x => {
        if (x === "-") return 0;
        if (x === ".") return 2;
        return -1;
      })
    );
    this.map = this.make.tilemap({
      data: level,
      tileWidth: BLOCK_SIZE,
      tileHeight: BLOCK_SIZE
    });
    const tileset = this.map.addTilesetImage("tiles");
    this.platforms = this.map.createStaticLayer(0, tileset, 0, 0);
    this.map.setCollision([0, 2]);
  }

  createScoreText() {
    this.scoreText = this.add.text(16, 16, "" + scoreKeeper.score, {
      fontSize: "20px",
      fill: "#fff"
    });
  }

  createLevelText() {
    this.levelText = this.add
      .text(BLOCK_SIZE * 8, 0, `Level ${this.letter}`, {
        fontFamily: FONT_FAMILY,
        fontSize: "32px",
        fill: "#fff"
      })
      .setOrigin(0.5, 0);
  }

  updateScore() {
    scoreKeeper.score += 10;
    this.scoreText.setText(scoreKeeper.score);
    if (this.entities.letters.group.countActive(true) === 0) {
      this.scene.start(this.config.nextLevel);
    }
  }

  playerHit() {
    this.entities.lives.removeLife();
    this.playerEntity.hit();
  }

  addLife() {
    this.entities.lives.addLife();
  }
}
