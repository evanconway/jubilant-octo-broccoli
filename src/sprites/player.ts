import { MoveDirection, ItemResolutionResponse, GAME_WORLD_TILE_HEIGHT, GAME_WORLD_TILE_WIDTH } from "../constants";
import GameScene from "../scenes/GameScene";
import InventoryScene from "../scenes/InventoryScene";
import { GameSprite } from "./GameSprite";

enum PlayerActionState { NORMAL, ITEM_MODE }
enum PlayerSpriteState { FACE_DOWN, FACE_UP, FACE_LEFT, FACE_RIGHT };

export class Player extends GameSprite {
    private spriteState: PlayerSpriteState;
    private _actionState: PlayerActionState;
    private inventoryScene: InventoryScene;

    constructor(scene: GameScene, x: number, y: number, startFrame: number) {
        super(scene, x, y, startFrame);

        this.inventoryScene = this.scene.scene.get("inventory") as InventoryScene;

        this.spriteState = PlayerSpriteState.FACE_DOWN;
        this.updateOrientation();
        this.setOrigin(0, 0);
    }

    public recItem(item: string): ItemResolutionResponse {
        return ItemResolutionResponse.NONE;
    }

    public getText(): string {
        throw new Error("this should never be called");
    }

    public isCollidable(): boolean {
        return true;
    }

    private updateOrientation() {
        this.setFlip(false, false);
        switch (this.spriteState) {
            case PlayerSpriteState.FACE_UP:
                this.setFrameRelative(2);
                break;
            case PlayerSpriteState.FACE_DOWN:
                this.setFrameRelative(0);
                break;
            case PlayerSpriteState.FACE_LEFT: {
                this.setFlip(true, false);
                this.setFrameRelative(1);
                break;
            }
            case PlayerSpriteState.FACE_RIGHT:
                this.setFrameRelative(1);
                break;
        }
    }

    isUsingItem(): boolean {
        return this._actionState === PlayerActionState.ITEM_MODE;
    }

    enterItemMode() {
        this._actionState = PlayerActionState.ITEM_MODE;
    }

    exitItemMode() {
        this._actionState = PlayerActionState.NORMAL;
    }

    faceRight() {
        this.spriteState = PlayerSpriteState.FACE_RIGHT;
        this._actionState = PlayerActionState.NORMAL;
        this.updateOrientation();
    }

    faceLeft() {
        this.spriteState = PlayerSpriteState.FACE_LEFT;
        this._actionState = PlayerActionState.NORMAL;
        this.updateOrientation();
    }

    faceDown() {
        this.spriteState = PlayerSpriteState.FACE_DOWN;
        this._actionState = PlayerActionState.NORMAL;
        this.updateOrientation();
    }

    faceUp() {
        this.spriteState = PlayerSpriteState.FACE_UP;
        this._actionState = PlayerActionState.NORMAL;
        this.updateOrientation();
    }

    moveInDirection(direction: MoveDirection) {
      if (direction === MoveDirection.UP) {
        this.moveUp();
      } else if (direction === MoveDirection.DOWN) {
        this.moveDown();
      } else if (direction === MoveDirection.LEFT) {
        this.moveLeft();
      } else if (direction === MoveDirection.RIGHT) {
        this.moveRight();
      }
    }

    moveRight() {
        this.x += GAME_WORLD_TILE_WIDTH
        this.faceRight();
    }

    moveLeft() {
        this.x -= GAME_WORLD_TILE_WIDTH
        this.faceLeft();
    }

    moveUp() {
        this.y -= GAME_WORLD_TILE_HEIGHT
        this.faceUp();
    }

    moveDown() {
        this.y += GAME_WORLD_TILE_HEIGHT
        this.faceDown();
    }
}
