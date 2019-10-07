import GameScene from "../scenes/GameScene";
import { GAME_WORLD_TILE_WIDTH, GAME_WORLD_TILE_HEIGHT } from "../constants";

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

    public abstract recItem(item: string): boolean;
    public abstract isCollidable(): boolean;

    get gridX(): number {
        return Math.floor(this.x / GAME_WORLD_TILE_WIDTH);
    }

    get gridY(): number {
        return Math.floor(this.y / GAME_WORLD_TILE_HEIGHT);
    }
}
