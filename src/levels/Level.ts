import { GameSprite } from '../sprites/GameSprite';
import { Player } from '../sprites/player';

export default class Level {
    private validWords: Set<string>;
    private spritesIterableCache: GameSprite[];

    constructor(public levelSprites: Map<number, GameSprite[]>, public tileMap: Phaser.Tilemaps.Tilemap) {
        this.validWords = new Set<string>(["nog", "hog", "g", "hot", "hit"]);

        this.spritesIterableCache = [];
        for (let spriteId of this.levelSprites.keys()) {
            for (let sprite of this.levelSprites.get(spriteId)) {
                this.spritesIterableCache.push(sprite);
            }
        }
    }

    public isValidWord(word: string) {
        return this.validWords.has(word);
    }

    public getPlayer(): Player {
        return this.levelSprites.get(23)[0] as Player;
    }

    public update(): void {
        for (let sprite of this.spritesIterableCache) {
            sprite.update();
        }
    }

    public getSpritesIterable(): GameSprite[] {
        return [... this.spritesIterableCache];
    }
}