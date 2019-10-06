import GameScene from '../scenes/GameScene';
import { GameSprite } from './GameSprite';

export class Gate extends GameSprite {
    constructor(scene: GameScene, x: number, y: number, startFrame: number) {
        super(scene, x, y, startFrame);
    }
}
