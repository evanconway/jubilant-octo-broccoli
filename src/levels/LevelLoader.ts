import GameScene from '../scenes/GameScene';
import SpriteLoader from '../SpriteLoader';
import { Altar } from '../sprites/Altar';
import { Book } from '../sprites/Book';
import { GameSprite } from '../sprites/GameSprite';
import { Gate } from '../sprites/Gate';
import { Guard } from "../sprites/Guard";
import { IceFloor } from '../sprites/IceFloor';
import { IceWall } from '../sprites/IceWall';
import { Player } from '../sprites/Player';
import { Sarcophagus } from '../sprites/Sarcophagus';
import { TextArea } from '../sprites/TextArea';
import Level from './Level';
import { LevelData, LEVEL_DATA } from './LevelData';

export default class LevelLoader {
    public static async loadLevel(scene: GameScene, levelNum: number): Promise<Level> {
        let tileMap: Phaser.Tilemaps.Tilemap = await LevelLoader.asyncLoadTilemap(scene, `assets/level_${levelNum}.json`);
        const spriteMap = new Map<number, any>([
            [15, Gate],
            [22, Player],
            [25, Sarcophagus],
            [26, Guard],
            [27, Sarcophagus],
            [28, Sarcophagus],
            [30, IceWall],
            [31, Guard],
            [34, IceFloor],
            [35, IceFloor],
            [36, IceFloor],
            [42, Altar],
            [43, Altar],
            [44, Altar],
            [45, Guard],
            [46, Guard],
            [47, Guard],
            [48, Guard],
            [49, Guard],
            [50, Guard],
            [51, Guard],
            [52, TextArea],
            [53, TextArea],
            [54, TextArea],
            [55, TextArea],
            [56, TextArea],
            [57, TextArea],
            [58, TextArea],
            [59, TextArea],
            [60, TextArea],
            [61, TextArea],
            [62, TextArea],
            [63, TextArea],
            [73, Guard],
            [74, Guard],
            [75, Sarcophagus],
            [102, Book],
            [103, Book],
            [104, Book],
            [105, Book],
            [106, Book],
            [107, Book],
            [108, Book],
            [109, Book],
            [110, Book],
            [111, Book],
        ]);

        const sprites: Map<number, GameSprite[]> = SpriteLoader.createSpritesFromTileset(
            spriteMap,
            scene,
            tileMap.getLayer("Objects"),
            tileMap.getTileset("tiles")
        );

        let levelData: LevelData = LEVEL_DATA[levelNum - 1];

        return new Level(sprites, tileMap, levelData.validWords, levelData.textAreas, levelData.startingInventory);
    }

    public static async asyncLoadTilemap(scene: Phaser.Scene, path: string): Promise<Phaser.Tilemaps.Tilemap> {
        let config = await fetch('assets/tiles.json').then(r => r.json());
        let mapDataJson = await fetch(path).then(r => r.json());
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