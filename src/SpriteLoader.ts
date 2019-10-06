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
    ): Map<number, Phaser.GameObjects.Sprite[]> {
        var sprites = new Map<number, Phaser.GameObjects.Sprite[]>();

        for (let y = 0; y < tileLayer.height; y++) {
            for (let x = 0; x < tileLayer.width; x++) {
                let currentTileGid = (tileLayer.data as unknown as any)[y][x].index;
                if (currentTileGid == -1) {
                    continue;
                }
                if (spriteMapping.has(currentTileGid)) {
                    var sprite = scene.make.sprite({
                        x: x * tileSet.tileWidth,
                        y: y * tileSet.tileHeight,
                        origin: [0, 0],
                        ...spriteMapping.get(currentTileGid)
                    });
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