import GameScene from '../scenes/GameScene';
import { GameSprite } from './GameSprite';
import { ItemResolutionResponse } from "../constants";

const TUT = 75;
const TOP_CHEST = 25;
const BOTTOM_CHEST = 27;

export class Sarcophagus extends GameSprite {
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
        if( this.active) {
            if (this.startFrame == TUT) {
                if (item == "tut") {
                    this.currentText = "The sarcophagus speaks:\nThat's me! King Tut. You can pass.";
                    return ItemResolutionResponse.DESTROY;
                } else {
                    this.currentText = "Inscribed on the coffin is:\nI am the most phamous pharoah. What is my three-letter nickname?";
                    return ItemResolutionResponse.PRINT_TEXT;
                }
            } else if (this.startFrame == TOP_CHEST) {
                if (item == "none") { // TODO
                    this.currentText = "TODO";
                    return ItemResolutionResponse.CREATE_LETTER_X;
                } else {
                    this.currentText = "TODO";
                    return ItemResolutionResponse.PRINT_TEXT;
                }
            } else if (this.startFrame == BOTTOM_CHEST) {
                if (item == "none") { // TODO
                    this.currentText = "TODO";
                    return ItemResolutionResponse.CREATE_LETTER_Y;
                } else {
                    this.currentText = "TODO";
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
