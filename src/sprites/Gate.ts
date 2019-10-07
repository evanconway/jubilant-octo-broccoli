import GameScene from '../scenes/GameScene';
import { GameSprite } from './GameSprite';
import { ItemResolutionResponse } from "../constants";

export class Gate extends GameSprite {
    constructor(scene: GameScene, x: number, y: number, startFrame: number) {
        super(scene, x, y, startFrame);
    }

    public isCollidable(): boolean {
        return this.active;
    }

    public recItem(item: string): ItemResolutionResponse {
        if (this.active) {
            console.log("Gate got item " + item);
            if (item == "thin") {
                return ItemResolutionResponse.PASS_THROUGH;
            }
        }
        return ItemResolutionResponse.NONE;
    }
}
