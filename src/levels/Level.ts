import { GameSprite } from '../sprites/GameSprite';
import { Player } from '../sprites/player';
import { TextArea } from '../sprites/TextArea';

export default class Level {
    private spritesIterableCache: GameSprite[];
    private textAreasIterableCache: TextArea[];

    constructor(
        public levelSprites: Map<number, GameSprite[]>,
        public tileMap: Phaser.Tilemaps.Tilemap,
        private validWords: Set<string>,
        private textAreas: Map<string, string>
    ) {
        this.spritesIterableCache = [];
        this.textAreasIterableCache = [];
        for (let spriteId of this.levelSprites.keys()) {
            for (let sprite of this.levelSprites.get(spriteId)) {
                this.spritesIterableCache.push(sprite);
                if (sprite instanceof TextArea) {
                    let key: string = `${sprite.gridX},${sprite.gridY}`;
                    if (textAreas.has(key)) {
                        sprite.setText(textAreas.get(key));
                    } else {
                        console.warn(`Warning: No text set for textArea (${sprite.gridX},${sprite.gridY})`);
                    }
                    this.textAreasIterableCache.push(sprite);
                }
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

    public getTextAreasIterable(): TextArea[] {
        return [... this.textAreasIterableCache];
    }
}