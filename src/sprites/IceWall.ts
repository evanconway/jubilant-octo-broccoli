import GameScene from '../scenes/GameScene';
import { GameSprite } from './GameSprite';
import { ItemResolutionResponse } from "../constants";

export class IceWall extends GameSprite {
    private currentText: string;
    constructor(scene: GameScene, x: number, y: number, startFrame: number) {
        super(scene, x, y, startFrame);
    }

    public isCollidable(): boolean {
        return this.active;
    }

    public getText(): string {
        return this.currentText;
    }

    public recItem(item: string): ItemResolutionResponse {
      if (this.active) {
          if (item == "hot") {
              this.currentText = "You melt the ice with your hot body ;)";
              return ItemResolutionResponse.DESTROY;
          } else {
              this.currentText = "This icy wall needs some heat to melt away!";
              return ItemResolutionResponse.PRINT_TEXT;
          }
      }
      return ItemResolutionResponse.NONE;
    }
}
