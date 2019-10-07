import GameScene from '../scenes/GameScene';
import { GameSprite } from './GameSprite';
import { ItemResolutionResponse } from "../constants";

const WORD_MAP: Map<number, string[]> = new Map<number, string[]>([
    [102, [
        "vido",
        "vido",
    ]],
    [103, [
        "vido",
        "vido",
    ]],
    [104, [
        "vido",
        "vido",
    ]],
    [105, [
        "vido",
        "vido",
    ]],
    [106, [
        "vido",
        "vido",
    ]],
    [107, [
        "vido",
        "vido",
    ]],
    [108, [
        "vido",
        "vido",
    ]],
    [109, [
        "vido",
        "vido",
    ]],
    [110, [
        "vido",
        "vido",
    ]],
    [111, [
        "vido",
        "vido",
    ]],
]);

export class Book extends GameSprite {
    private hint: string;
    private defeatWord: string;
    private currentString: string;

    constructor(scene: GameScene, x: number, y: number, startFrame: number) {
        super(scene, x, y, startFrame);
        if (!WORD_MAP.has(startFrame)) {
            throw new Error(`No dialogue in Book.ts for book id ${startFrame}`);
        }
        this.defeatWord = WORD_MAP.get(startFrame)[0];
        this.hint = WORD_MAP.get(startFrame)[1];
        
    }

    public isCollidable(): boolean {
        return this.active;
    }

    public getText(): string {
        return this.currentString;
    }

    public recItem(item: string): ItemResolutionResponse {
        if (this.active) {
            if (item == this.defeatWord) {
                this.currentString = "The book glows, then disappears";
                return ItemResolutionResponse.DESTROY;
            } else {
                this.currentString = "The book reads:\n" + this.hint;
                return ItemResolutionResponse.PRINT_TEXT;
            }
        }
        return ItemResolutionResponse.NONE;
    }
}