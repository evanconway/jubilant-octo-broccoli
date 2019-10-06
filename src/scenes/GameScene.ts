import { Player } from "../sprites/player";
import ReadoutScene from "./ReadoutScene";
import { TEXT_AREA_HEIGHT_PX, GAME_WORLD_TILE_WIDTH, GAME_WORLD_TILE_HEIGHT } from "../constants";
import { Enemy } from "../sprites/enemy";

export default class GameScene extends Phaser.Scene {
    private player: Player;
    private enemy: Enemy;
    // enemies/ creatures
    // worldGrid


    private exampleText: Phaser.GameObjects.Text;
    private exampleActive: boolean = true;
    private inventoryKey: Phaser.Input.Keyboard.Key;
    private cursorKeys: Phaser.Types.Input.Keyboard.CursorKeys;
    private readoutScene: ReadoutScene;
    private tileMap: Phaser.Tilemaps.Tilemap;

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
        this.load.spritesheet("hero_sprite", "../assets/hero_sprite.png", {
            frameWidth: 32, frameHeight: 32
        });
    }

    public create() {
        this.exampleText = this.add.text(10, 10, "Hi Everybody", { font: '16px Courier', fill: '#00ff00' });
        this.game.input.mouse.capture = true;
        this.inventoryKey = this.input.keyboard.addKey("I");
        this.cursorKeys = this.input.keyboard.createCursorKeys();

        this.tileMap = this.make.tilemap({ key: 'level_1' });
        const tileset: Phaser.Tilemaps.Tileset = this.tileMap.addTilesetImage('tiles', 'tiles');

        this.tileMap.createStaticLayer("Map", tileset, 0, 0);

        this.tileMap.createFromObjects("Objects", 2, { key: "gate" });

        this.cameras.main.setBounds(0, 0, this.tileMap.widthInPixels, this.tileMap.heightInPixels);
        this.cameras.main.setViewport(0, 0, this.game.canvas.width, this.game.canvas.height - TEXT_AREA_HEIGHT_PX);

        this.player = new Player(this, 96, 96, "hero_sprite");
        this.player.setOrigin(0, 0);

        this.add.existing(this.player);

        this.enemy = new Enemy(this, 192, 192, "hero_sprite")
        this.add.existing(this.enemy);

        // Apparently you can't just instanciate it 🤦‍
        // Also you can't write to the readout scene here, wait until next event loop
        this.scene.launch("readout");
        this.readoutScene = this.scene.get("readout") as ReadoutScene;
    }

    public write(text: string) {
        this.readoutScene.write(text);
    }

    private getTileProperty(tileX: number, tileY: number, property: string): any {
        return (this.tileMap.getTileAt(tileX, tileY).properties as any)[property];
    }

    private playerCanMove(playerTileX: number, playerTileY: number) {
        if (playerTileX < 0 || playerTileX > this.tileMap.width || playerTileY < 0 || playerTileY > this.tileMap.height) {
            return false;
        }
        return !(this.getTileProperty(playerTileX, playerTileY, "collision"));
    }

    private movePlayer(): boolean {
        const playerTileX = this.player.gridX;
        const playerTileY = this.player.gridY;
        if (Phaser.Input.Keyboard.JustDown(this.cursorKeys.up)) {
            console.log(playerTileX, playerTileY);
            if (this.playerCanMove(playerTileX, playerTileY - 1)) {
                this.player.moveUp();
            }
        } else if (Phaser.Input.Keyboard.JustDown(this.cursorKeys.down)) {
            if (this.playerCanMove(playerTileX, playerTileY + 1)) {
                this.player.moveDown();
            }
        } else if (Phaser.Input.Keyboard.JustDown(this.cursorKeys.left)) {
            if (this.playerCanMove(playerTileX - 1, playerTileY)) {
                this.player.moveLeft();
            }
        } else if (Phaser.Input.Keyboard.JustDown(this.cursorKeys.right)) {
            if (this.playerCanMove(playerTileX + 1, playerTileY)) {
                this.player.moveRight();
            }
        }
        return false;
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

        if (this.movePlayer()) {
            this.enemy.update(this.player);
        }
    }
}
