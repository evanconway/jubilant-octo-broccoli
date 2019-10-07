import GameScene from '../scenes/GameScene';
import { GameSprite } from './GameSprite';

export class Sarcophagus extends GameSprite {
    constructor(scene: GameScene, x: number, y: number, startFrame: number) {
        super(scene, x, y, startFrame);
    }

    public isCollidable(): boolean {
        return this.active;
    }

    // This is like, bonus points or something

    public recItem(item: string): boolean {
        console.log("Sarcophagus got item " + item);
        return false;
    }
}
