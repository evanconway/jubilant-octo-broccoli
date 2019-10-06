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
                let currentTileGid: number = tileLayer.data[y * tileLayer.width + x];
                if (spriteMapping.has(currentTileGid)) {
                    var sprite = scene.make.sprite({
                        x,
                        y,
                        ...spriteMapping.get(currentTileGid),
                        ...tileSet.getTileProperties(currentTileGid - 1) // If there's a bug this is prolly it.
                    });
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