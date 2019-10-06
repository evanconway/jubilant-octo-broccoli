import GameScene from '../scenes/GameScene';

export class Gate extends Phaser.GameObjects.Sprite {
    constructor(scene: GameScene, x: number, y: number, key: string) {
        super(scene, x, y, key);
        this.setFrame(15);
    }
}