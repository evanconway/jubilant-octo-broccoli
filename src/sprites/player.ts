import { Properties, BaseActor } from "../resources/actors";

class PlayerActor extends BaseActor {
  constructor() {
    super(new Properties(10, 10, 10, 10));
  }
}

export class Player extends Phaser.GameObjects.Sprite {
    private actor: PlayerActor;

    constructor(scene: Phaser.Scene, x: number, y: number, key: string) {
        super(scene, x, y, key);
        this.actor = new PlayerActor();
    }
}
