import { GAME_WORLD_TILE_HEIGHT, GAME_WORLD_TILE_WIDTH } from "../constants"
import { Properties, BaseActor } from "../resources/actors";

class PlayerActor extends BaseActor {
  constructor() {
    super(new Properties(10, 10, 10, 10));
  }
}

enum PlayerSpriteState { FACE_DOWN, FACE_UP, FACE_LEFT, FACE_RIGHT };

export class Player extends Phaser.GameObjects.Sprite {
    private actor: PlayerActor;
    private spriteState: PlayerSpriteState;

    constructor(scene: Phaser.Scene, x: number, y: number, key: string) {
        super(scene, x, y, key);
        this.actor = new PlayerActor();
        this.spriteState = PlayerSpriteState.FACE_DOWN;
        this.updateOrientation();
    }

    private updateOrientation() {
      this.setFlip(false, false);
      switch (this.spriteState) {
        case PlayerSpriteState.FACE_UP:
          this.setFrame(2);
          break;
        case PlayerSpriteState.FACE_DOWN:
          this.setFrame(0);
          break;
        case PlayerSpriteState.FACE_LEFT: {
          this.setFlip(true, false);
          this.setFrame(1);
          break;
        }
        case PlayerSpriteState.FACE_RIGHT:
          this.setFrame(1);
          break;
      }
    }

    moveRight() {
      this.x += GAME_WORLD_TILE_WIDTH
      this.spriteState = PlayerSpriteState.FACE_RIGHT;
      this.updateOrientation()
    }

    moveLeft() {
      this.x -= GAME_WORLD_TILE_WIDTH
      this.spriteState = PlayerSpriteState.FACE_LEFT;
      this.updateOrientation()
    }

    moveUp() {
      this.y -= GAME_WORLD_TILE_HEIGHT
      this.spriteState = PlayerSpriteState.FACE_UP;
      this.updateOrientation()
    }

    moveDown() {
      this.y += GAME_WORLD_TILE_HEIGHT
      this.spriteState = PlayerSpriteState.FACE_DOWN;
      this.updateOrientation()
    }
}
