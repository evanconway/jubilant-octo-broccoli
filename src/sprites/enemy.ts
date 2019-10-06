import { GAME_WORLD_TILE_HEIGHT, GAME_WORLD_TILE_WIDTH } from "../constants"
import { Properties, BaseActor } from "../resources/actors";
import GameScene from "../scenes/GameScene";


class EnemyActor extends BaseActor {
    constructor() {
        super(new Properties(10, 10, 10, 10));
    }
}

enum EnemySpriteState { FACE_DOWN, FACE_UP, FACE_LEFT, FACE_RIGHT };

export class Enemy extends Phaser.GameObjects.Sprite {
    private actor: EnemyActor;
    private spriteState: EnemySpriteState;

    constructor(scene: Phaser.Scene, x: number, y: number, key: string) {
        super(scene, x, y, key);
        this.actor = new EnemyActor();
        this.spriteState = EnemySpriteState.FACE_DOWN;
        this.updateOrientation();
        this.setOrigin(0, 0);
    }

    private updateOrientation() {
        this.setFlip(false, false);
        switch (this.spriteState) {
            case EnemySpriteState.FACE_UP:
                this.setFrame(2);
                break;
            case EnemySpriteState.FACE_DOWN:
                this.setFrame(0);
                break;
            case EnemySpriteState.FACE_LEFT: {
                this.setFlip(true, false);
                this.setFrame(1);
                break;
            }
            case EnemySpriteState.FACE_RIGHT:
                this.setFrame(1);
                break;
        }
    }

    moveRight() {
        this.x += GAME_WORLD_TILE_WIDTH
        this.spriteState = EnemySpriteState.FACE_RIGHT;
        this.updateOrientation()
    }

    moveLeft() {
        this.x -= GAME_WORLD_TILE_WIDTH
        this.spriteState = EnemySpriteState.FACE_LEFT;
        this.updateOrientation()
    }

    moveUp() {
        this.y -= GAME_WORLD_TILE_HEIGHT
        this.spriteState = EnemySpriteState.FACE_UP;
        this.updateOrientation()
    }

    moveDown() {
        this.y += GAME_WORLD_TILE_HEIGHT
        this.spriteState = EnemySpriteState.FACE_DOWN;
        this.updateOrientation()
    }

    public update_position(player: Phaser.GameObjects.Sprite, gameScene: GameScene) {
        const choice = Math.random();
        if (choice < 0.25) {
            if (gameScene.playerCanMove(this.gridX, this.gridY + 1)) {
                this.moveDown();
            }
        } else if (choice < 0.5) {
            if (gameScene.playerCanMove(this.gridX - 1, this.gridY)) {
                this.moveLeft();
            }
        } else if (choice < 0.75) {
            if (gameScene.playerCanMove(this.gridX, this.gridY - 1)) {
                this.moveUp();
            }
        } else {
            if (gameScene.playerCanMove(this.gridX + 1, this.gridY)) {
              this.moveRight();
            }
        }
    }

    get gridX(): number {
      return Math.floor(this.x / GAME_WORLD_TILE_WIDTH);
    }

    get gridY(): number {
      return Math.floor(this.y / GAME_WORLD_TILE_HEIGHT);
    }
}
