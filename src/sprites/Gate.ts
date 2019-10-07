import GameScene from '../scenes/GameScene';
import { GameSprite } from './GameSprite';
import { ItemResolutionResponse } from "../constants";

export class Gate extends GameSprite {
    private currentString: string;
    constructor(scene: GameScene, x: number, y: number, startFrame: number) {
        super(scene, x, y, startFrame);
    }

    public isCollidable(): boolean {
        return this.active;
    }

    public getText() {
        return this.currentString;
    }

    public recItem(item: string): ItemResolutionResponse {
        if (this.active) {
            if (item == "thin") {
                this.currentString = "You slip between the bars of the gate.";
                return ItemResolutionResponse.PASS_THROUGH;
            } else {
                this.currentString = "If you could lose some weight, you might be able to slip between the bars...";
                return ItemResolutionResponse.PRINT_TEXT;
            }
        }
        return ItemResolutionResponse.NONE;
    }
}
