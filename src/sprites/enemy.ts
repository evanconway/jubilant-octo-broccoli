import { GAME_WORLD_TILE_HEIGHT, GAME_WORLD_TILE_WIDTH } from "../constants"
import { Properties, BaseActor } from "../resources/actors";
import GameScene from "../scenes/GameScene";
import { Attack } from "./Attack";
import { GameSprite } from './GameSprite';


class EnemyActor extends BaseActor {
    constructor() {
        super(new Properties(10, 10, 10, 10));
    }
}

enum EnemySpriteState { FACE_DOWN, FACE_UP, FACE_LEFT, FACE_RIGHT };

interface Directions {
  dx: number;
  dy: number;
  dir: EnemySpriteState;
}

interface WeightedDirections extends Directions {
  weight: number;
}

export class Enemy extends GameSprite {
    private actor: EnemyActor;
    private spriteState: EnemySpriteState;

    private gameScene: GameScene;

    constructor(scene: GameScene, x: number, y: number, startFrame: number) {
        super(scene, x, y, startFrame);
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

    move(dx: number, dy: number, state: EnemySpriteState) {
        this.x += GAME_WORLD_TILE_WIDTH * dx;
        this.y += GAME_WORLD_TILE_HEIGHT * dy;
        this.spriteState = state;
        this.updateOrientation;
    }
    public update_position(player: Phaser.GameObjects.Sprite) {

        const deltaX = player.x - this.x;
        const deltaY = player.y - this.y;
        
        const deltaXSqrd = deltaX * deltaX;
        const deltaYSqrd = deltaY * deltaY;


        const dist = Math.sqrt(deltaXSqrd + deltaYSqrd)
        
        if (dist > 12 * GAME_WORLD_TILE_WIDTH) {
            return;
        }
    
        const weights: Map<string, WeightedDirections> = new Map([
          ["up", {"dx": 0, "dy": -1, "dir": EnemySpriteState.FACE_UP, weight: 0}],
          ["down", {"dx": 0, "dy": 1, "dir": EnemySpriteState.FACE_DOWN, weight: 0}],
          ["left", {"dx": -1, "dy": 0, "dir": EnemySpriteState.FACE_LEFT, weight: 0}],
          ["right", {"dx": 1,  "dy": 0, "dir": EnemySpriteState.FACE_RIGHT, weight: 0}],
        ]);

        if (deltaXSqrd == deltaYSqrd) {
          if (deltaX > 0) {
            weights.get("right").weight += 1
          } else if (deltaX < 0) {
            weights.get("left").weight += 1
          }
          if (deltaY > 0) {
            weights.get("down").weight += 1
          } else if (deltaY < 0) {
            weights.get("up").weight += 1
          } 
        } else if (deltaXSqrd > deltaYSqrd) {
          if (deltaX > 0) {
            weights.get("right").weight += 2
          } else if (deltaX < 0) {
            weights.get("left").weight += 2
          }
          if (deltaY > 0) {
            weights.get("down").weight += 1
          } else if (deltaY < 0) {
            weights.get("up").weight += 1
          } 
        } else if (deltaXSqrd < deltaYSqrd) {
          if (deltaX > 0) {
            weights.get("right").weight += 1
          } else if (deltaX < 0) {
            weights.get("left").weight += 1
          }
          if (deltaY > 0) {
            weights.get("down").weight += 2
          } else if (deltaY < 0) {
            weights.get("up").weight += 2
          } 
        }

        const sortedWeights: WeightedDirections[] = new Array<WeightedDirections>();
        for (let weight of weights.values()) {
            sortedWeights.push(weight);
        }
        sortedWeights.sort((a: WeightedDirections, b: WeightedDirections) => b.weight - a.weight)

        let moved = false;
        for (let weightedDirection of sortedWeights) {
            if (! this.gameScene.isTilePassable(this.gridX + weightedDirection.dx, this.gridY + weightedDirection.dy)) {
              continue;
            }
            this.move(weightedDirection.dx, weightedDirection.dy, weightedDirection.dir);
            moved = true;
            break;
            const attack = new Attack(this.scene, this.gridX, this.gridY + 1, "tiles_sprites", "fire_attack");
            this.scene.add.existing(attack);
        }
    }

    get gridX(): number {
      return Math.floor(this.x / GAME_WORLD_TILE_WIDTH);
    }

    get gridY(): number {
      return Math.floor(this.y / GAME_WORLD_TILE_HEIGHT);
    }
}
