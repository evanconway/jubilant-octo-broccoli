import GameScene from '../scenes/GameScene';
import { GameSprite } from './GameSprite';
import { Item, Key } from "../resources/items";

export class Gate extends GameSprite {
    constructor(scene: GameScene, x: number, y: number, startFrame: number) {
        super(scene, x, y, startFrame);
    }

    public isCollidable(): boolean {
      return this.active;
    }

    public recItem(item: Item): void {
      if (item instanceof Key) {
        this.destroy();
      }
    }
}
