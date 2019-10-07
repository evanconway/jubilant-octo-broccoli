import GameScene from '../scenes/GameScene';
import { GameSprite } from './GameSprite';
import { ItemResolutionResponse } from "../constants";

const WORD_MAP: Map<number, string[]> = new Map<number, string[]>([
    [102, [
        "moved",
        "You’ve followed a road that’s now grooved\nYou’ve made your location improved\nYou’ve unpacked your crate\nIn a different state\nAll of these things mean you’ve _____",
    ]],
    [103, [
        "dime",
        "The smallest coin made at the time\nOr a beauty you find to be prime\nIt’s worth just ten cents\nYou must have some sense\nTo know that we call it a ____"
    ]],
    [104, [
        "pied",
        "Bozo the clown has just died\nChoked on some cream, it’s implied\nHe was covered in crust\nWhen he bit the dust,\nWhat happened? Well, Bozo got ____",
    ]],
    [105, [
        "voted",
        "I can say that I have promoted\nThe candidate I think should be noted\nI went to the poll\nI marked on the scroll\nAnd now I can say that I _____",
    ]],
    [106, [
        "typed",
        "This paper I have here is unstriped\nAnd once inked, it cannot be wiped\nI put it in the feed\nI hit letters on keys\nIt’s not written, you’ll find that it’s _____",
    ]],
    [107, [
        "movie",
        "An actor I know went to prove he\nCan be sad, or happy, or groovy,\nHe appeared on the screen\nIn a violent scene\nBut it’s O.K., it’s just a _____",
    ]],
    [108, [
        "deity",
        "If the big bang was not spontaneity,\nAnd gods have no homogeneity,\nMany voices would say\n\"I want you to pray\"\nSo now I must choose my _____",
    ]],
    [109, [
        "mode",
        "When I sit down to a meal to reload\nIn the coldest place in my abode\nI grab the ice cream\nIt scoops like a dream\nI want my meal to be a la ____",
    ]],
    [110, [
        "omit",
        "This limerick wasn’t a good fit\nYou’ll have to rely on your fine wit\nTo make something gone\n(that was there all along)\nThe word that we say is ____",
    ]],
    [111, [
        "depot",
        "You know that I’m kind of a cheap-o\nI didn’t want my engine to get repo’d\nSo I hid it away\n(I don’t want to pay)\nBut I’ll tell you: it’s behind the train _____",
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