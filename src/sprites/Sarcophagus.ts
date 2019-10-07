import GameScene from '../scenes/GameScene';
import { GameSprite } from './GameSprite';
import { ItemResolutionResponse } from "../constants";

export class Sarcophagus extends GameSprite {
    private currentText: string;
    private isTut: boolean = false;

    constructor(scene: GameScene, x: number, y: number, startFrame: number) {
        super(scene, x, y, startFrame);
        if (startFrame == 75) {
            this.isTut = true;
        }
    }

    public isCollidable(): boolean {
        return this.active;
    }

    public getText(): string {
        return this.currentText;
    }

    public recItem(item: string): ItemResolutionResponse {
        if( this.active) {
            if (this.isTut) {
                if (item == "tut") {
                    this.currentText = "The sarcophagus speaks:\nThat's me! King Tut. You can pass.";
                    return ItemResolutionResponse.DESTROY;
                } else {
                    this.currentText = "Inscribed on the coffin is:\nI am the most phamous pharoah. What is my three-letter nickname?";
                    return ItemResolutionResponse.PRINT_TEXT;
                }
            } else {
                if (item == "ingot") {
                    this.currentText = "Inside the sarcophagus, you find\nthe letter \"L\"!";
                    return ItemResolutionResponse.CREATE_LETTER_L;
                } else {
                    this.currentText = "The mummy's coffin is missing a golden bar. Perhaps you can replace it...";
                    return ItemResolutionResponse.PRINT_TEXT;
                }
            }
        }
        
        return ItemResolutionResponse.NONE;
    }
}
