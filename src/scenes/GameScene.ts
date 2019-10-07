import { Player } from "../sprites/Player";
import ReadoutScene from "./ReadoutScene";
import { ItemResolutionResponse, MoveDirection, MOVE_DELAY, INVENTORY_HEIGHT_PX, GAME_WORLD_TILE_WIDTH, GAME_WORLD_TILE_HEIGHT, READOUT_WIDTH_PX } from "../constants";
import { GameSprite } from "../sprites/GameSprite";
import InventoryScene from "./InventoryScene";
import LevelLoader from '../levels/LevelLoader';
import Level from '../levels/Level';
import { TextArea } from '../sprites/TextArea';

export default class GameScene extends Phaser.Scene {
    private isFullyLoaded: boolean = false;
    private lastTimeKeyPressed: number = Date.now();
    private menuKey: Phaser.Input.Keyboard.Key;

    // If a item tells the game to let the player pass through it, we queue
    // up an event here to process it during the next time we process input events
    private syntheticMoveDirectionQueue: MoveDirection[] = [];

    private cursorKeys: Phaser.Types.Input.Keyboard.CursorKeys;

    private currentLevelIndex: number = 0; // this will go to 1
    private currentLevel: Level;

    private readoutScene: ReadoutScene;
    private inventoryScene: InventoryScene;

    constructor() {
        super({ key: "game" });
    }

    public preload() {
        // do preloads in menu scene
    }

    public create() {
        this.game.input.mouse.capture = true;
        this.cursorKeys = this.input.keyboard.createCursorKeys();
        this.menuKey = this.input.keyboard.addKey("esc");

        this.scene.launch("readout");
        this.readoutScene = this.scene.get("readout") as ReadoutScene;

        this.scene.launch("inventory");
        this.inventoryScene = this.scene.get("inventory") as InventoryScene;

        this.nextLevel();
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

    private executeMoveAction(player: Player, nextPlayerX: number, nextPlayerY: number, direction: MoveDirection, forceMove: boolean = false): boolean {
        if (forceMove) {
            const sprite = this.getSpriteAtLocation(nextPlayerX, nextPlayerY);
            if(sprite) {
                this.write(sprite.getText());
            }
            player.moveInDirection(direction);
            this.lastTimeKeyPressed = Date.now();
            const itemResponse = this.applyItem(sprite);
            if (itemResponse === ItemResolutionResponse.PASS_THROUGH) {
                this.syntheticMoveDirectionQueue.push(direction);
            }
            return true;
        }

        const sprite = this.getSpriteAtLocation(nextPlayerX, nextPlayerY);
        const itemResponse = this.applyItem(sprite);

        if (itemResponse !== ItemResolutionResponse.NONE) {
            switch (itemResponse) {
                case ItemResolutionResponse.PASS_THROUGH:
                    this.syntheticMoveDirectionQueue.push(direction);
                    break;
                case ItemResolutionResponse.CREATE_LETTER_L:
                    sprite.destroy();
                    this.inventoryScene.addLetters("l");
                    this.inventoryScene.putBackAllLetters();
                    break;
                case ItemResolutionResponse.DESTROY:
                    sprite.destroy();
                    this.inventoryScene.putBackAllLetters();
                    break;
                case ItemResolutionResponse.PRINT_TEXT:
                    break;
                default:
                    console.warn(`Warning: No handler for itemResolutionResponse ${itemResponse}`);
            }
            this.write(sprite.getText());
            this.lastTimeKeyPressed = Date.now();
            return true;
        } else if (this.isTilePassableForPlayer(nextPlayerX, nextPlayerY)) {
            this.readoutScene.clear();
            player.moveInDirection(direction);
            this.lastTimeKeyPressed = Date.now();
            return true;
        }
        return false;
    }

    private getNextPlayerPosition(player: Player, direction: MoveDirection) {
        const playerTileX = player.gridX;
        const playerTileY = player.gridY;

        if (direction === MoveDirection.UP) {
            return { x: playerTileX, y: playerTileY - 1 }
        } else if (direction === MoveDirection.DOWN) {
            return { x: playerTileX, y: playerTileY + 1 }
        } else if (direction === MoveDirection.LEFT) {
            return { x: playerTileX - 1, y: playerTileY }
        } else if (direction === MoveDirection.RIGHT) {
            return { x: playerTileX + 1, y: playerTileY }
        }
    }

    private handleMoveInput(): boolean {
        const player: Player = this.currentLevel.getPlayer();

        if (Phaser.Input.Keyboard.JustDown(this.cursorKeys.up)) {
            const nextPos = this.getNextPlayerPosition(player, MoveDirection.UP);
            return this.executeMoveAction(player, nextPos.x, nextPos.y, MoveDirection.UP);
        } else if (Phaser.Input.Keyboard.JustDown(this.cursorKeys.down)) {
            const nextPos = this.getNextPlayerPosition(player, MoveDirection.DOWN);
            return this.executeMoveAction(player, nextPos.x, nextPos.y, MoveDirection.DOWN);
        } else if (Phaser.Input.Keyboard.JustDown(this.cursorKeys.left)) {
            const nextPos = this.getNextPlayerPosition(player, MoveDirection.LEFT);
            return this.executeMoveAction(player, nextPos.x, nextPos.y, MoveDirection.LEFT);
        } else if (Phaser.Input.Keyboard.JustDown(this.cursorKeys.right)) {
            const nextPos = this.getNextPlayerPosition(player, MoveDirection.RIGHT);
            return this.executeMoveAction(player, nextPos.x, nextPos.y, MoveDirection.RIGHT);
        }

        return false;
    }

    private applyItem(targetSprite: GameSprite): ItemResolutionResponse {
        const item = this.inventoryScene.getItemString();
        if (targetSprite) {
            return targetSprite.recItem(item);
        }
        return ItemResolutionResponse.NONE;
    }

    private handleKeyboardInputs() {
        const player: Player = this.currentLevel.getPlayer();
        if (this.handleMoveInput()) {
            let textArea: TextArea | null = this.currentLevel.getTextAreasIterable().find(s => s.gridX === player.gridX && s.gridY === player.gridY);
            if (textArea) {
                this.readoutScene.write(textArea.getText());
            }
            this.currentLevel.update();
        }
    }

    public nextLevel(): void {
        this.currentLevelIndex++;
        if (this.currentLevel) {
            this.currentLevel.tileMap.destroy();
            this.currentLevel.getSpritesIterable().forEach(s => s.destroy());
        }
        LevelLoader.loadLevel(this, this.currentLevelIndex).then((level) => {
            this.currentLevel = level;
            this.isFullyLoaded = true;

            const gameViewportWidth = this.game.canvas.width;
            const gameViewportHeight = this.game.canvas.height - INVENTORY_HEIGHT_PX;
            const deadZoneSize = 160; // pixels

            this.cameras.main.setBounds(0, 0, this.currentLevel.tileMap.widthInPixels, this.currentLevel.tileMap.heightInPixels);
            this.cameras.main.setViewport(0, 0, gameViewportWidth, gameViewportHeight);
            this.cameras.main.deadzone = new Phaser.Geom.Rectangle(
                deadZoneSize, deadZoneSize, gameViewportWidth - (deadZoneSize * 2), gameViewportHeight - (deadZoneSize * 2)
            );
            this.cameras.main.startFollow(this.currentLevel.getPlayer());

            this.inventoryScene.setLetters(level.getStartingInventory(), level.getMaxValidWordLength());

            this.children.bringToTop(this.currentLevel.getPlayer());
        });
    }

    public update(time: number, delta: number) {
        if (!this.isFullyLoaded) {
            return;
        }
        super.update(time, delta);

        if (this.syntheticMoveDirectionQueue.length) {
            if (this.lastTimeKeyPressed + MOVE_DELAY < Date.now()) {
                const nextSyntheticMoveDirection = this.syntheticMoveDirectionQueue.pop();
                const player: Player = this.currentLevel.getPlayer();
                const nextPos = this.getNextPlayerPosition(player, nextSyntheticMoveDirection);
                this.executeMoveAction(player, nextPos.x, nextPos.y, nextSyntheticMoveDirection, true);
            }
        } else {
            this.handleKeyboardInputs();
        }

        if (Phaser.Input.Keyboard.JustDown(this.menuKey)) {
            this.scene.switch("menu");
        }
    }
}
