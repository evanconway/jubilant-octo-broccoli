export default class InventoryScene extends Phaser.Scene {
    constructor() {
        super({
            key: "inventory"
        })
    }

    public create() {
        this.add.text(10, 10, "Inventory", { font: '16px Courier', fill: '#00ff00' });

        this.input.on('keydown', function(event: KeyboardEvent) {
            if(event.key == "i") {
                this.scene.switch("game")
            }
          });
    }
}