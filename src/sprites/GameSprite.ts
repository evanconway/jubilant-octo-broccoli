import GameScene from "../scenes/GameScene";
import { Item } from "../resources/items";

export abstract class GameSprite extends Phaser.GameObjects.Sprite {
    protected startFrame: number;

    constructor(scene: GameScene, x: number, y: number, startFrame: number) {
      super(scene, x, y, "tiles_sprites");
      this.startFrame = startFrame;
      this.setFrameRelative(0);
    }

    protected setFrameRelative(frame: number) {
      this.setFrame(frame + this.startFrame);
    }

    public abstract recItem(item: Item): void;
    public abstract isCollidable(): boolean;
}
