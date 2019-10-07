import { GameSprite } from '../sprites/GameSprite';

export default class Level {
    private validWords: Set<string>;

    constructor(public levelSprites: Map<number, GameSprite[]>, public tileMap: Phaser.Tilemaps.Tilemap) {
        this.validWords = new Set<string>(["nog", "hog", "gey"]);
    }

    public isValidWord(word: string) {
        return this.validWords.has(word);
    }
}