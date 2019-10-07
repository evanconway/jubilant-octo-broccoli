import { GameSprite } from '../sprites/GameSprite';
import { Player } from '../sprites/player';

export default class Level {
    private validWords: Set<string>;

    constructor(public levelSprites: Map<number, GameSprite[]>, public tileMap: Phaser.Tilemaps.Tilemap) {
        this.validWords = new Set<string>(["nog", "hog", "gey"]);
    }

    public isValidWord(word: string) {
        return this.validWords.has(word);
    }

    public getPlayer(): Player {
        return this.levelSprites.get(23)[0] as Player;
    }

    public update(): void {
        for (let spriteId of this.levelSprites.keys()) {
            for (let sprite of this.levelSprites.get(spriteId)) {
                sprite.update();
            }
        }
    }
}