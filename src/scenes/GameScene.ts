import { Player } from "../sprites/player";
import ReadoutScene from "./ReadoutScene";
import { INVENTORY_HEIGHT_PX, GAME_WORLD_TILE_WIDTH, GAME_WORLD_TILE_HEIGHT, READOUT_WIDTH_PX } from "../constants";
import { ItemTargetOverlay } from "./itemTargetOverlay";
import { GameSprite } from "../sprites/GameSprite";
import InventoryScene from "./InventoryScene";
import LevelLoader from '../levels/LevelLoader';
import Level from '../levels/Level';

export default class GameScene extends Phaser.Scene {
    private isFullyLoaded: boolean = false;

    private exampleText: Phaser.GameObjects.Text;
    private exampleActive: boolean = true;
    private itemModeKey: Phaser.Input.Keyboard.Key;
    private cursorKeys: Phaser.Types.Input.Keyboard.CursorKeys;
    private readoutScene: ReadoutScene;
    private itemTargetChoicesOverlay: ItemTargetOverlay;
    private levelSprites: GameSprite[];

    private currentLevel: Level;

    private inventoryScene: InventoryScene;

    constructor() {
        super({ key: "game" });
        this.levelSprites = [];
    }

    public preload() {
        this.load.image("tiles", "../assets/tiles.png");
        this.load.spritesheet("tiles_sprites", "../assets/tiles.png", {
            frameWidth: 32, frameHeight: 32
        });
    }

    public create() {
        this.exampleText = this.add.text(10, 10, "Hi Everybody", { font: '16px Courier', fill: '#00ff00' });
        this.game.input.mouse.capture = true;
        this.cursorKeys = this.input.keyboard.createCursorKeys();
        this.itemModeKey = this.input.keyboard.addKey("Z");

        this.scene.launch("readout");
        this.readoutScene = this.scene.get("readout") as ReadoutScene;

        this.scene.launch("inventory");
        this.inventoryScene = this.scene.get("inventory") as InventoryScene;

        this.itemTargetChoicesOverlay = new ItemTargetOverlay(this);

        LevelLoader.loadLevel(this, 1).then((level) => {
            this.currentLevel = level;
            this.isFullyLoaded = true;
            this.cameras.main.setBounds(0, 0, this.currentLevel.tileMap.widthInPixels, this.currentLevel.tileMap.heightInPixels);
            this.cameras.main.setViewport(0, 0, this.game.canvas.width - READOUT_WIDTH_PX, this.game.canvas.height - INVENTORY_HEIGHT_PX);
        });
    }

    public isValidWord(text: string) {
        return this.currentLevel.isValidWord(text);
    }

    public getCurrentItem(): string {
        return this.inventoryScene.getItemString();
    }

    public write(text: string) {
        this.readoutScene.write(text);
    }

    private getTileProperty(tileX: number, tileY: number, property: string): any {
        return (this.currentLevel.tileMap.getTileAt(tileX, tileY).properties as any)[property];
    }

    private getSpriteAtLocation(tileX: number, tileY: number): GameSprite | null {
        // This is terrible
        for (let sprite of this.levelSprites) {
            if (Math.round(sprite.x / GAME_WORLD_TILE_WIDTH) == tileX
                && Math.round(sprite.y / GAME_WORLD_TILE_HEIGHT) == tileY) {
                return sprite;
            }
        }
        return null;
    }

    public isTilePassable(tileX: number, tileY: number) {
        if (tileX < 0 || tileX >= this.currentLevel.tileMap.width || tileY < 0 || tileY >= this.currentLevel.tileMap.height) {
            return false;
        }
        const sprite = this.getSpriteAtLocation(tileX, tileY);
        if (sprite && sprite.isCollidable()) {
            return false;
        }
        return !(this.getTileProperty(tileX, tileY, "collision"));
    }

    public isTilePassableForPlayer(tileX: number, tileY: number) {
        return this.isTilePassable(tileX, tileY);
    }

    private handleMoveInput(): boolean {
        const player: Player = this.currentLevel.getPlayer();
        const playerTileX = player.gridX;
        const playerTileY = player.gridY;

        if (Phaser.Input.Keyboard.JustDown(this.cursorKeys.up)) {
            if (this.isTilePassableForPlayer(playerTileX, playerTileY - 1)) {
                player.moveUp();
                return true;
            }
        } else if (Phaser.Input.Keyboard.JustDown(this.cursorKeys.down)) {
            if (this.isTilePassableForPlayer(playerTileX, playerTileY + 1)) {
                player.moveDown();
                return true;
            }
        } else if (Phaser.Input.Keyboard.JustDown(this.cursorKeys.left)) {
            if (this.isTilePassableForPlayer(playerTileX - 1, playerTileY)) {
                player.moveLeft();
                return true;
            }
        } else if (Phaser.Input.Keyboard.JustDown(this.cursorKeys.right)) {
            if (this.isTilePassableForPlayer(playerTileX + 1, playerTileY)) {
                player.moveRight();
                return true;
            }
        }

        return false;
    }

    private applyItem(tileX: number, tileY: number) {
      const item = this.inventoryScene.getItemString();
      const targetSprite = this.getSpriteAtLocation(tileX, tileY);
      if (item && targetSprite) {
        targetSprite.recItem(item);
      }
    }

    private handleItemInput(): void {
        const player: Player = this.currentLevel.getPlayer();
        const playerTileX = player.gridX;
        const playerTileY = player.gridY;

        if (Phaser.Input.Keyboard.JustDown(this.cursorKeys.up)) {
            player.exitItemMode();
            player.faceUp();
            this.applyItem(playerTileX, playerTileY - 1);
        } else if (Phaser.Input.Keyboard.JustDown(this.cursorKeys.down)) {
            player.exitItemMode();
            player.faceDown();
            this.applyItem(playerTileX, playerTileY + 1);
        } else if (Phaser.Input.Keyboard.JustDown(this.cursorKeys.left)) {
            player.exitItemMode();
            player.faceLeft();
            this.applyItem(playerTileX - 1 , playerTileY);
        } else if (Phaser.Input.Keyboard.JustDown(this.cursorKeys.right)) {
            player.exitItemMode();
            player.faceRight();
            this.applyItem(playerTileX + 1 , playerTileY);
        }

        if (!player.isUsingItem()) {
            this.itemTargetChoicesOverlay.clear();
        }
    }

    private handleKeyboardInputs() {
        const player: Player = this.currentLevel.getPlayer();
        if (Phaser.Input.Keyboard.JustDown(this.itemModeKey) && !player.isUsingItem()) {
            player.enterItemMode();
            this.itemTargetChoicesOverlay.render(player);
        } else if (player.isUsingItem()) {
            this.handleItemInput();
        } else {
            if (this.handleMoveInput()) {
                this.currentLevel.update();
            }
        }
    }

    public update(time: number, delta: number) {
        if (!this.isFullyLoaded) {
            return;
        }
        super.update(time, delta);

        if (this.exampleActive) this.exampleText.setAlpha(1);
        else this.exampleText.setAlpha(0);

        this.handleKeyboardInputs();
    }
}
