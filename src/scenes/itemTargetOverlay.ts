import { GAME_WORLD_TILE_WIDTH, GAME_WORLD_TILE_HEIGHT } from "../constants"
import { Player } from "../sprites/player"

export class ItemTargetOverlay {
    private overlayGraphics: Phaser.GameObjects.Graphics;

    constructor(scene: Phaser.Scene) {
      this.overlayGraphics = scene.add.graphics()
    }

    render(player: Player) {
      const item = player.getCurrentItem();
      // Get the items "reach"
      const reach = 1;

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
