import GameScene from '../scenes/GameScene';
import { GameSprite } from './GameSprite';
import { ItemResolutionResponse } from "../constants";

export class IceWall extends GameSprite {
    constructor(scene: GameScene, x: number, y: number, startFrame: number) {
        super(scene, x, y, startFrame);
    }

    public isCollidable(): boolean {
        return this.active;
    }

    public getText(): string {
        return "This icy wall needs some heat to melt away!";
    }

    public recItem(item: string): ItemResolutionResponse {
      if (this.active) {
          console.log("Ice got item " + item);
          if (item == "hot") {
              this.destroy();
              return ItemResolutionResponse.DESTROY;
          }
      }
      return ItemResolutionResponse.NONE;
    }
}
