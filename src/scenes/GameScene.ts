import { Player } from "../sprites/player";
import ReadoutScene from "./ReadoutScene";
import { TEXT_AREA_HEIGHT_PX } from "../constants";

export default class GameScene extends Phaser.Scene {
    private player: Player
    // enemies/ creatures
    // worldGrid


    private exampleText: Phaser.GameObjects.Text;
    private exampleActive: boolean = true;
    private inventoryKey: Phaser.Input.Keyboard.Key;
    private cursorKeys: Phaser.Types.Input.Keyboard.CursorKeys;
    private readoutScene: ReadoutScene;

    constructor() {
        super({
            key: "game"
        })
    }

    public preload() {
        this.load.image("tiles", "../assets/tiles.png");
        this.load.image("gate", "../assets/gate.png");
        this.load.tilemapTiledJSON("level_1", "../assets/level_1.json");
        this.load.tilemapTiledJSON("level_2", "../assets/level_2.json");
        this.load.spritesheet("hero_sprite", "../assets/hero_sprite_2.png", {
          frameWidth: 32, frameHeight: 32
        });
    }

    public create() {
        this.exampleText = this.add.text(10, 10, "Hi Everybody", { font: '16px Courier', fill: '#00ff00' });
        this.game.input.mouse.capture = true;
        this.inventoryKey = this.input.keyboard.addKey("I");
        this.cursorKeys = this.input.keyboard.createCursorKeys();

        const map: Phaser.Tilemaps.Tilemap = this.make.tilemap({ key: 'level_1' });
        const tileset: Phaser.Tilemaps.Tileset = map.addTilesetImage('tiles', 'tiles');

        map.createStaticLayer("Map", tileset, 0, 0);

        map.createFromObjects("Objects", 2, { key: "gate" });

        this.cameras.main.setBounds(0, 0, map.widthInPixels, map.heightInPixels);
        this.cameras.main.setViewport(0, 0, this.game.canvas.width, this.game.canvas.height - TEXT_AREA_HEIGHT_PX);

        this.player = new Player(this, 108, 108, "hero_sprite");

        this.add.existing(this.player);

        // Apparently you can't just instanciate it 🤦‍
        // Also you can't write to the readout scene here, wait until next event loop
        this.scene.launch("readout");
        this.readoutScene = this.scene.get("readout") as ReadoutScene;
    }

    public write(text: string) {
        this.readoutScene.write(text);
    }

    public update(time: number, delta: number) {
        if (Phaser.Input.Keyboard.JustDown(this.inventoryKey)) {
            this.scene.switch("inventory");
            let superlative = ["good job", "lol", "nice", "great", "super", "stellar"][(Math.random() * 6) | 0]
            this.write(`Opened Inventory (${superlative})`);
        }

        //if (this.input.mouse.onMouseDown()) this.exampleActive = !this.exampleActive;

        if (this.exampleActive) this.exampleText.setAlpha(1);
        else this.exampleText.setAlpha(0);


        if(Phaser.Input.Keyboard.JustDown(this.cursorKeys.up)) {
          this.player.moveUp();
        } else if(Phaser.Input.Keyboard.JustDown(this.cursorKeys.down)) {
          this.player.moveDown();
        } else if(Phaser.Input.Keyboard.JustDown(this.cursorKeys.left)) {
          this.player.moveLeft();
        } else if(Phaser.Input.Keyboard.JustDown(this.cursorKeys.right)) {
          this.player.moveRight();
        }
    }
}
