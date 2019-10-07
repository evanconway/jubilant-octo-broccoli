import GameScene from '../scenes/GameScene';
import { GameSprite } from './GameSprite';

export class IceWall extends GameSprite {
    constructor(scene: GameScene, x: number, y: number, startFrame: number) {
        super(scene, x, y, startFrame);
    }

    public isCollidable(): boolean {
      return this.active;
    }

    public recItem(item: string): void {
      console.log("Ice got item " + item);
      if (item == "hot") {
        this.destroy();
      }
    }
}
