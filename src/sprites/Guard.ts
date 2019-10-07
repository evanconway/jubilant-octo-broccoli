import GameScene from '../scenes/GameScene';
import { GameSprite } from './GameSprite';
import { ItemResolutionResponse } from "../constants";

export class Guard extends GameSprite {
    constructor(scene: GameScene, x: number, y: number, startFrame: number) {
        super(scene, x, y, startFrame);
    }

    public isCollidable(): boolean {
        return this.active;
    }

    public recItem(item: string): ItemResolutionResponse {
        if (this.active) {
            console.log("Guard got item " + item);
            if (item == "hit") {
                this.destroy();
                return ItemResolutionResponse.DESTROY;
            }
        }
        return ItemResolutionResponse.NONE;
    }
}
