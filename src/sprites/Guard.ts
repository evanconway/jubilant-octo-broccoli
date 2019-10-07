import GameScene from '../scenes/GameScene';
import { GameSprite } from './GameSprite';

export class Guard extends GameSprite {
    constructor(scene: GameScene, x: number, y: number, startFrame: number) {
        super(scene, x, y, startFrame);
    }

    public isCollidable(): boolean {
        return this.active;
    }

    public recItem(item: string): boolean {
        if (this.active) {
            console.log("Guard got item " + item);
            if (item == "hit") {
                this.destroy();
                return true;
            }
        }
        return false;
    }
}
