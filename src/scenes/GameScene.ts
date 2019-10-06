import { Player } from "../sprites/player";
import ReadoutScene from "./ReadoutScene";
import { TEXT_AREA_HEIGHT_PX, GAME_WORLD_TILE_WIDTH, GAME_WORLD_TILE_HEIGHT } from "../constants";

export default class GameScene extends Phaser.Scene {
    private player: Player
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

    private getTileProperty(tileX: number, tileY: number, property: string): any {
        console.log(property, (this.tileMap.getTileAt(tileX, tileY) as any)[property]);
        return (this.tileMap.getTileAt(tileX, tileY) as any)[property];
    }

    private playerCanMove(playerTileX: number, playerTileY: number) {
        return !(this.getTileProperty(playerTileX, playerTileY - 1, "collision"));
    }

    private movePlayer(): boolean {
        const playerTileX = Math.round(this.player.x / GAME_WORLD_TILE_WIDTH);
        const playerTileY = Math.round(this.player.y / GAME_WORLD_TILE_HEIGHT);
        if (Phaser.Input.Keyboard.JustDown(this.cursorKeys.up)) {
            if (this.playerCanMove(playerTileX, playerTileY - 1)) {
                this.player.moveUp();
                return true;
            }
        } else if (Phaser.Input.Keyboard.JustDown(this.cursorKeys.down)) {
            if (this.playerCanMove(playerTileX, playerTileY + 1)) {
                this.player.moveDown();
                return true;
            }
        } else if (Phaser.Input.Keyboard.JustDown(this.cursorKeys.left)) {
            if (this.playerCanMove(playerTileX - 1, playerTileY)) {
                this.player.moveLeft();
                return true;
            }
        } else if (Phaser.Input.Keyboard.JustDown(this.cursorKeys.right)) {
            if (this.playerCanMove(playerTileX + 1, playerTileY)) {
                this.player.moveRight();
                return true;
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

        this.movePlayer();
    }
}
