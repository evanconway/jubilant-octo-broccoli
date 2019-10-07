import GameScene from '../scenes/GameScene';
import { GameSprite } from './GameSprite';
import { ItemResolutionResponse } from "../constants";

const WORD_MAP: Map<number, string[]> = new Map<number, string[]>([
    [26, [
        "todo",
        "todo",
        "todo"
    ]],
    [31, [
        "nonexy", // TODO
        "todo",
        "todo"
    ]],
    [45, [
        "light",
        "It's really dark in this next room.\nI'm not going in there unless it's brighter.",
        "Ahh, yes. That light makes it so much\neasier to see."
    ]],
    [46, [
        "hog",
        "I'm not moving until I get some roast pork. I love to pig out. Do you have some?",
        "Mmm, yeah, that's some good meat."]],
    [47, [
        "hit",
        "I'm going to punch you! You better not punch me back!",
        "Augh!"
    ]],
    [48, [
        "vat", //TODO
        "I want to put your brain in one of these!",
        "I put the horse before Descartes"
    ]],
    [49, [
        "ant",
        "I will crush you like a little ____",
        "I ant even...",
    ]],
    [50, [
        "one",
        "You have to solve my riddle before I let you pass!\nWhat comes after naught?",
        "Hahah! You guessed correctly.\nYou may pass."
    ]],
    [51, [
        "neon",
        "I really want one of those cool store signs, you know, the light up ones that say \"open\".\nCould you bring me one?",
        "Yeah! That's the stuff. Thanks."
    ]],
    [73, [
        "trial",
        "Another word for challenge or test,\nor something given at justice's behest?\nThe word for this, my guarding style?\nThe word is: _____",
        "Guilty as charged!",
    ]],
    [74, [
        "trail",
        "To get past my riddles and codes,\nknow that this tomb contains no paved roads\nTell me the word for a path in the woods\nand I'll let you in for good!",
        "with that said, lets begin our tale!",
    ]]
]);

export class Guard extends GameSprite {
    private defeatWord: string;
    private talkString: string;
    private defeatString: string;
    private currentString: string;

    constructor(scene: GameScene, x: number, y: number, startFrame: number) {
        super(scene, x, y, startFrame);
        if (!WORD_MAP.has(startFrame)) {
            throw new Error(`No dialogue in Guard.ts for guard id ${startFrame}`);
        }
        this.defeatWord = WORD_MAP.get(startFrame)[0];
        this.talkString = WORD_MAP.get(startFrame)[1];
        this.defeatString = WORD_MAP.get(startFrame)[2];
    }

    public isCollidable(): boolean {
        return this.active;
    }

    public getText(): string {
        return "The guard says:\n" + this.currentString;
    }

    public recItem(item: string): ItemResolutionResponse {
        if (this.active) {
            if (item == this.defeatWord) {
                this.currentString = this.defeatString;
                return ItemResolutionResponse.DESTROY;
            } else if (this.defeatWord === "light" && item === "night") {
                this.currentString = "No, No! I said I wanted something to make it brighter, not darker!"
                return ItemResolutionResponse.PRINT_TEXT;
            } else {
                this.currentString = this.talkString;
                return ItemResolutionResponse.PRINT_TEXT;
            }
        }
        return ItemResolutionResponse.NONE;
    }
}
