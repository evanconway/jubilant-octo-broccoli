import GameScene from '../scenes/GameScene';
import { GameSprite } from './GameSprite';
import { ItemResolutionResponse } from "../constants";

export class Altar extends GameSprite {
    constructor(scene: GameScene, x: number, y: number, startFrame: number) {
        super(scene, x, y, startFrame);
    }

    public isCollidable(): boolean {
        return this.active;
    }

    public getText(): string {
        return "TODO";
    }

    public recItem(item: string): ItemResolutionResponse {
        if (this.active) {
            (this.scene as GameScene).nextLevel();
            this.destroy();
            return ItemResolutionResponse.DESTROY;
        }
        return ItemResolutionResponse.NONE;
    }
}