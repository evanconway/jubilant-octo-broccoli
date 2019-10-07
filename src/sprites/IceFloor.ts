import GameScene from '../scenes/GameScene';
import { GameSprite } from './GameSprite';
import { ItemResolutionResponse } from "../constants";

export class IceFloor extends GameSprite {
    constructor(scene: GameScene, x: number, y: number, startFrame: number) {
        super(scene, x, y, startFrame);
    }

    public isCollidable(): boolean {
        return false;
    }

    public getText(): string {
        return "You slide on the icy floor!";
    }

    public recItem(item: string): ItemResolutionResponse {
        if (this.active) {
            return ItemResolutionResponse.SLIP;
        }
        return ItemResolutionResponse.NONE;
    }
}
