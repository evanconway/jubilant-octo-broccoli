export default class InventoryScene extends Phaser.Scene {

    private testText: Phaser.GameObjects.Text;
    private inventoryKey: Phaser.Input.Keyboard.Key;

    constructor() {
        super({
            key: "inventory"
        })
    }

    public create() {
        this.add.text(10, 10, "Inventory", { font: '16px Courier', fill: '#00ff00' });

        this.testText = this.add.text(100, 100, "Sup doods", { font: '16px Courier', fill: '#00ff00' });
        this.inventoryKey = this.input.keyboard.addKey("I");

    }

    public update() {
        if (Phaser.Input.Keyboard.JustDown(this.inventoryKey)) {
            this.scene.switch("game");
            console.log("Switch to game.");
        }
    }
}