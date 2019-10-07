import { GameSprite } from "./sprites/GameSprite";

export default class SpriteLoader {
    /**
 * The built-in createFromObjects doesn't correctly load tileSet default attributes.
 * Original Source: https://github.com/photonstorm/phaser/blob/v3.19.0/src/tilemaps/Tilemap.js#L606
 */
    public static createSpritesFromTileset(
        spriteMapping: Map<number, any>,
        scene: Phaser.Scene,
        tileLayer: Phaser.Tilemaps.LayerData,
        tileSet: Phaser.Tilemaps.Tileset
    ): Map<number, GameSprite[]> {
        var sprites = new Map<number, GameSprite[]>();

        for (let y = 0; y < tileLayer.height; y++) {
            for (let x = 0; x < tileLayer.width; x++) {
                let tile = (tileLayer.data as unknown as any)[y][x];
                if (!tile) {
                    continue;
                }
                let currentTileGid = tile.index;
                if (spriteMapping.has(currentTileGid)) {
                    let SpriteClass = spriteMapping.get(currentTileGid);
                    let sprite: GameSprite;
                    if (SpriteClass) {
                        sprite = new SpriteClass(scene, x * tileSet.tileWidth, y * tileSet.tileHeight, currentTileGid - 1);
                        sprite.setOrigin(0, 0);
                        scene.add.existing(sprite);
                    } else {
                        throw new Error("Bad class!");
                    }

                    // If there's a bug this "-1" is prolly it.
                    let properties: any = (tileSet.tileProperties as unknown as any)[currentTileGid - 1];
                    if (properties) {
                        for (let key in properties) {
                            sprite.setData(key, properties[key]);
                        }
                    }
                    if (!sprites.has(currentTileGid)) {
                        sprites.set(currentTileGid, []);
                    }
                    sprites.get(currentTileGid).push(sprite);
                } else {
                    console.warn(`Sprite with gid ${currentTileGid} present in map but not sprite mapping.`);
                }
            }
        }
        return sprites;
    }
}
