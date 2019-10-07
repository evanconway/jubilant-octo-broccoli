import { Player } from "../sprites/player";
import ReadoutScene from "./ReadoutScene";
import { MOVE_DELAY, INVENTORY_HEIGHT_PX, GAME_WORLD_TILE_WIDTH, GAME_WORLD_TILE_HEIGHT, READOUT_WIDTH_PX } from "../constants";
import { GameSprite } from "../sprites/GameSprite";
import InventoryScene from "./InventoryScene";
import LevelLoader from '../levels/LevelLoader';
import Level from '../levels/Level';
import { TextArea } from '../sprites/TextArea';

export default class GameScene extends Phaser.Scene {
    private isFullyLoaded: boolean = false;
    private lastTimeKeyPressed: number = Date.now();

    private cursorKeys: Phaser.Types.Input.Keyboard.CursorKeys;

    private currentLevel: Level;

    private readoutScene: ReadoutScene;
    private inventoryScene: InventoryScene;

    constructor() {
        super({ key: "game" });
    }

    public preload() {
        this.load.image("tiles", "../assets/tiles.png");
        this.load.spritesheet("tiles_sprites", "../assets/tiles.png", {
            frameWidth: 32, frameHeight: 32
        });
    }

    public create() {
        this.game.input.mouse.capture = true;
        this.cursorKeys = this.input.keyboard.createCursorKeys();

        this.scene.launch("readout");
        this.readoutScene = this.scene.get("readout") as ReadoutScene;

        this.scene.launch("inventory");
        this.inventoryScene = this.scene.get("inventory") as InventoryScene;


        LevelLoader.loadLevel(this, 1).then((level) => {
            this.currentLevel = level;
            this.isFullyLoaded = true;

            const gameViewportWidth = this.game.canvas.width - READOUT_WIDTH_PX;
            const gameViewportHeight = this.game.canvas.height - INVENTORY_HEIGHT_PX;
            const deadZoneSize = 160; // pixels

            this.cameras.main.setBounds(0, 0, this.currentLevel.tileMap.widthInPixels, this.currentLevel.tileMap.heightInPixels);
            this.cameras.main.setViewport(0, 0, gameViewportWidth, gameViewportHeight);
            this.cameras.main.deadzone = new Phaser.Geom.Rectangle(
                deadZoneSize, deadZoneSize, gameViewportWidth - (deadZoneSize * 2), gameViewportHeight - (deadZoneSize * 2)
            );
            this.cameras.main.startFollow(this.currentLevel.getPlayer());
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
        for (let sprite of this.currentLevel.getSpritesIterable()) {
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

        if (this.lastTimeKeyPressed + MOVE_DELAY > Date.now()) {
          return false;
        }

        if (this.cursorKeys.up.isDown) {
            const sprite = this.getSpriteAtLocation(playerTileX, playerTileY - 1);
            if (this.applyItem(sprite)) {
              this.lastTimeKeyPressed = Date.now();
              return true;
            } else if(this.isTilePassableForPlayer(playerTileX, playerTileY - 1)) {
                player.moveUp();
                this.lastTimeKeyPressed = Date.now();
                return true;
            }
        } else if (this.cursorKeys.down.isDown) {
            const sprite = this.getSpriteAtLocation(playerTileX, playerTileY + 1);
            if (this.applyItem(sprite)) {
              this.lastTimeKeyPressed = Date.now();
              return true;
            } else if (this.isTilePassableForPlayer(playerTileX, playerTileY + 1)) {
                player.moveDown();
                this.lastTimeKeyPressed = Date.now();
                return true;
            }
        } else if (this.cursorKeys.left.isDown) {
            const sprite = this.getSpriteAtLocation(playerTileX - 1, playerTileY);
            if (this.applyItem(sprite)) {
              this.lastTimeKeyPressed = Date.now();
              return true;
            } else if (this.isTilePassableForPlayer(playerTileX - 1, playerTileY)) {
                player.moveLeft();
                this.lastTimeKeyPressed = Date.now();
                return true;
            }
        } else if (this.cursorKeys.right.isDown) {
            const sprite = this.getSpriteAtLocation(playerTileX + 1, playerTileY);
            if (this.applyItem(sprite)) {
              this.lastTimeKeyPressed = Date.now();
              return true;
            } else if (this.isTilePassableForPlayer(playerTileX + 1, playerTileY)) {
                player.moveRight();
                this.lastTimeKeyPressed = Date.now();
                return true;
            }
        }

        return false;
    }

    private applyItem(targetSprite: GameSprite): boolean {
      const item = this.inventoryScene.getItemString();
      if (item && targetSprite) {
        return targetSprite.recItem(item);
      }
    }

    private handleKeyboardInputs() {
        const player: Player = this.currentLevel.getPlayer();
        if (this.handleMoveInput()) {
            console.log(this.currentLevel.getTextAreasIterable());
            let textArea: TextArea | null = this.currentLevel.getTextAreasIterable().find(s => s.gridX === player.gridX && s.gridY === player.gridY);
            if (textArea) {
                this.readoutScene.write(textArea.getText());
            } else {
                this.readoutScene.clear();
            }
            this.currentLevel.update();
        }
    }

    public update(time: number, delta: number) {
        if (!this.isFullyLoaded) {
            return;
        }
        super.update(time, delta);

        this.handleKeyboardInputs();
    }
}
