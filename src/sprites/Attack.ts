import { GAME_WORLD_TILE_HEIGHT, GAME_WORLD_TILE_WIDTH } from "../constants"

const ATTACKS: {[s: string]: {[s: string]: number}} = {
    "fire_attack": {
        "frame_count" : 6,
        "start_frame": 16
    }
}

const ANIMATION_LENGTH = 12;

export class Attack extends Phaser.GameObjects.Sprite {

    private frame_step = 0;
    private attackKey = "";

    constructor(scene: Phaser.Scene, tileX: number, tileY: number, key: string, attackKey="") {
        super(scene, tileX, tileY, key);
        this.setOrigin(0, 0);
        this.scene = scene;
        this.attackKey = attackKey;
        this.updateFrame()
        
        this.x = tileX * GAME_WORLD_TILE_WIDTH;
        this.y = tileY * GAME_WORLD_TILE_HEIGHT;

        this.scene.sys;
    }

    private updateFrame(): void {
        const frame = Math.floor((this.frame_step / ANIMATION_LENGTH)  *  ATTACKS[this.attackKey]["frame_count"])
        const start = ATTACKS[this.attackKey]["start_frame"]
        const abs_frame = start + frame;
        this.setFrame(abs_frame);
    }

    public preUpdate(time: number, delta: number): void {
        super.preUpdate(time, delta);
        if (this.frame_step >= ANIMATION_LENGTH) {
            this.destroy();
            return;
        }
        this.updateFrame();
        this.frame_step += 1;
    }
}