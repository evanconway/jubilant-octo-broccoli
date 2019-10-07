import { GAME_WORLD_TILE_WIDTH, GAME_WORLD_TILE_HEIGHT } from "../constants"
import { Player } from "../sprites/Player"
import GameScene from "./GameScene";

export class ItemTargetOverlay {
    private overlayGraphics: Phaser.GameObjects.Graphics;
    private gameScene: GameScene;

    constructor(scene: GameScene) {
      this.overlayGraphics = scene.add.graphics()
      this.gameScene = scene;
    }

    render(player: Player) {
      const item = this.gameScene.getCurrentItem();

      const playerGlobalX = player.x;
      const playerGlobalY = player.y;

      this.overlayGraphics.fillStyle(0x0000FF, .25);
      this.overlayGraphics.fillRect(playerGlobalX + GAME_WORLD_TILE_WIDTH, playerGlobalY, 32, 32);
      this.overlayGraphics.fillRect(playerGlobalX - GAME_WORLD_TILE_WIDTH, playerGlobalY, 32, 32);
      this.overlayGraphics.fillRect(playerGlobalX, playerGlobalY + GAME_WORLD_TILE_HEIGHT, 32, 32);
      this.overlayGraphics.fillRect(playerGlobalX, playerGlobalY - GAME_WORLD_TILE_HEIGHT, 32, 32);
    }

    clear() {
      this.overlayGraphics.clear();
    }
}
