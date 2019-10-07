import GameScene from '../scenes/GameScene';
import { GameSprite } from './GameSprite';
import { ItemResolutionResponse } from "../constants";

const TUT = 75;
const TOP_CHEST = 25;
const BOTTOM_CHEST = 27;
const FIRST_CHEST = 29;

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
            } else if (this.startFrame == FIRST_CHEST) {
                if (item == "ant") {
                    this.currentText = "The coffin apologizes:\nHere have the letter S"
                    return ItemResolutionResponse.CREATE_LETTER_S;
                } else {
                    this.currentText = "The coffin threatens:\nI will crush you like a little ____";
                    return ItemResolutionResponse.PRINT_TEXT;
                } 
            }else if (this.startFrame == TOP_CHEST) {
                if (item == "savant") {
                    this.currentText = "The coffin speaks:\nYes! Become by rhyming prodigy after your climbing oddessy! Here is the letter O";
                    return ItemResolutionResponse.CREATE_LETTER_O;
                } else {
                    this.currentText = "Inscribed on the coffin:\nWelcome to my haunt\nWhat is it that I want?\nI need someone smart!\nNot just any debutante";
                    return ItemResolutionResponse.PRINT_TEXT;
                }
            } else if (this.startFrame == BOTTOM_CHEST) {
                if (item == "sonata") {
                    this.currentText = "The coffin sings:\nClassical! Here is the letter M for merry!";
                    return ItemResolutionResponse.CREATE_LETTER_M;
                } else {
                    this.currentText = "Inscribed on the coffin:\n Dead, but I love the cello\n I'm a classical kind of fellow.\nPlease do not cease.\nWith a piano play this piece";
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
