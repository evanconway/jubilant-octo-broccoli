export default class GameScene extends Phaser.Scene {
    private square: Phaser.GameObjects.Rectangle;
    private exampleText: Phaser.GameObjects.Text;
    private exampleActive: boolean = true;
    private inventoryKey: Phaser.Input.Keyboard.Key;
    private cursorKeys: Phaser.Types.Input.Keyboard.CursorKeys;

    constructor() {
        super({
            key: "game"
        })
    }

    public create() {
        this.square = this.add.rectangle(400, 400, 100, 100, 0xFFFFFF);
        this.exampleText = this.add.text(10, 10, "Hi Everybody", { font: '16px Courier', fill: '#00ff00' });
        this.game.input.mouse.capture = true;
        this.inventoryKey = this.input.keyboard.addKey("I");
        this.cursorKeys = this.input.keyboard.createCursorKeys();
    }

    public update() {
        if (Phaser.Input.Keyboard.JustDown(this.inventoryKey)) {
            this.scene.switch("inventory");
            console.log("Switch to inventory.");
        }

        //if (this.input.mouse.onMouseDown()) this.exampleActive = !this.exampleActive;

        if (this.exampleActive) this.exampleText.setAlpha(1);
        else this.exampleText.setAlpha(0);

        if (this.cursorKeys.up.isDown && !this.cursorKeys.down.isDown) this.square.y -= 10;
        if (this.cursorKeys.down.isDown && !this.cursorKeys.up.isDown) this.square.y += 10;
        if (this.cursorKeys.left.isDown && !this.cursorKeys.right.isDown) this.square.x -= 10;
        if (this.cursorKeys.right.isDown && !this.cursorKeys.left.isDown) this.square.x += 10;
    }
}