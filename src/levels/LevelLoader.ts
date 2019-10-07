import Level from './Level';
import { Gate } from '../sprites/Gate';
import { IceWall } from '../sprites/IceWall';
import { Guard } from "../sprites/Guard";
import { Player } from '../sprites/Player';
import { GameSprite } from '../sprites/GameSprite';
import SpriteLoader from '../SpriteLoader';
import GameScene from '../scenes/GameScene';
import {LevelData, LEVEL_DATA} from './LevelData';
import { TextArea } from '../sprites/TextArea';
import { Altar } from '../sprites/Altar';
import { Sarcophagus } from '../sprites/Sarcophagus';
import { IceFloor } from '../sprites/IceFloor';

export default class LevelLoader {
    public static async loadLevel(scene: GameScene, levelNum: number): Promise<Level> {
        let tileMap: Phaser.Tilemaps.Tilemap = await LevelLoader.asyncLoadTilemap(scene, levelNum);
        const spriteMap = new Map<number, any>([
            [15, Gate],
            [22, Player],
            [28, Sarcophagus],
            [30, IceWall],
            [34, IceFloor],
            [35, IceFloor],
            [36, IceFloor],
            [45, Guard],
            [46, Guard],
            [47, Guard],
            [42, Altar],
            [43, Altar],
            [44, Altar],
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