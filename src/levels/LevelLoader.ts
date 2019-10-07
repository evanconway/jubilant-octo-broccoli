import Level from './Level';
import { Gate } from '../sprites/Gate';
import { Player } from '../sprites/player';
import { Enemy } from '../sprites/enemy';
import { GameSprite } from '../sprites/GameSprite';
import SpriteLoader from '../SpriteLoader';
import GameScene from '../scenes/GameScene';

export default class LevelLoader {
    public static async loadLevel(scene: GameScene, levelNum: number): Promise<Level> {
        let tileMap: Phaser.Tilemaps.Tilemap = await LevelLoader.asyncLoadTilemap(scene, levelNum);
        const level1SpriteMap = new Map<number, any>([
            [16, Gate],
            [23, Player],
            [26, Enemy],
        ]);

        const sprites: Map<number, GameSprite[]> = SpriteLoader.createSpritesFromTileset(
            level1SpriteMap,
            scene,
            tileMap.getLayer("Objects"),
            tileMap.getTileset("tiles")
        );

        return new Level(sprites, tileMap);
    }

    public static async asyncLoadTilemap(scene: Phaser.Scene, levelNum: number): Promise<Phaser.Tilemaps.Tilemap> {
        let config = await fetch('assets/tiles.json').then(r => r.json());
        let mapDataJson = await fetch(`assets/level_${levelNum}.json`).then(r => r.json());
        config.firstgid = 1;
        mapDataJson.tilesets = [config];
        let mapData: Phaser.Tilemaps.MapData = Phaser.Tilemaps.Parsers.Tiled.ParseJSONTiled(
            "tiles",
            mapDataJson,
            true
        );
        let tileMap = new Phaser.Tilemaps.Tilemap(scene, mapData);
        tileMap.addTilesetImage('tiles', 'tiles');
        tileMap.createStaticLayer("Map", tileMap.getTileset("tiles"), 0, 0);
        return tileMap;
    }
}