import { GAME_WORLD_TILE_HEIGHT, GAME_WORLD_TILE_WIDTH } from "../constants"
import { Properties, BaseActor } from "../resources/actors";
import GameScene from "../scenes/GameScene";
import { Attack } from "./Attack"; 


class EnemyActor extends BaseActor {
    constructor() {
        super(new Properties(10, 10, 10, 10));
    }
}

enum EnemySpriteState { FACE_DOWN, FACE_UP, FACE_LEFT, FACE_RIGHT };

export class Enemy extends Phaser.GameObjects.Sprite {
    private actor: EnemyActor;
    private spriteState: EnemySpriteState;

    private startFrame: number;

    private gameScene: GameScene;

    constructor(scene: GameScene, x: number, y: number, key: string, startFrame: number) {
        super(scene, x, y, key);
        this.actor = new EnemyActor();
        this.spriteState = EnemySpriteState.FACE_DOWN;
        this.startFrame = startFrame;
        this.updateOrientation();
        this.setOrigin(0, 0);
        this.gameScene = scene;
    }

    private updateOrientation() {
        this.setFlip(false, false);
        switch (this.spriteState) {
            case EnemySpriteState.FACE_UP:
                this.setFrameRelative(2);
                break;
            case EnemySpriteState.FACE_DOWN:
                this.setFrameRelative(0);
                break;
            case EnemySpriteState.FACE_LEFT: {
                this.setFlip(true, false);
                this.setFrameRelative(1);
                break;
            }
            case EnemySpriteState.FACE_RIGHT:
                this.setFrameRelative(1);
                break;
        }
    }

    // Override
    private setFrameRelative (frame: number): void{
        super.setFrame(frame + this.startFrame);
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

    public update_position(player: Phaser.GameObjects.Sprite) {
        const choice = Math.random();
        if (choice < 0.25) {
            if (this.gameScene.isTilePassable(this.gridX, this.gridY + 1)) {
                this.moveDown();

                const attack = new Attack(this.scene, this.gridX, this.gridY + 1, "tiles_sprites", "fire_attack");
                this.scene.add.existing(attack);
            }
        } else if (choice < 0.5) {
            if (this.gameScene.isTilePassable(this.gridX - 1, this.gridY)) {
                this.moveLeft();

                const attack = new Attack(this.scene, this.gridX - 1, this.gridY, "tiles_sprites", "fire_attack");
                this.scene.add.existing(attack);
            }
        } else if (choice < 0.75) {
            if (this.gameScene.isTilePassable(this.gridX, this.gridY - 1)) {
                this.moveUp();

                const attack = new Attack(this.scene, this.gridX, this.gridY - 1, "tiles_sprites", "fire_attack");
                this.scene.add.existing(attack);
            }
        } else {
            if (this.gameScene.isTilePassable(this.gridX + 1, this.gridY)) {
              this.moveRight();

              const attack = new Attack(this.scene, this.gridX + 1, this.gridY, "tiles_sprites", "fire_attack");
              this.scene.add.existing(attack);
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
