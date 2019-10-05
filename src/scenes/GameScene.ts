export default class GameScene extends Phaser.Scene {
    private square: Phaser.GameObjects.Rectangle;
    private exampleText: Phaser.GameObjects.Text;
    private exampleActive: boolean = true;
    private inventoryKey: Phaser.Input.Keyboard.Key;
    private cursorKeys: Phaser.Types.Input.Keyboard.CursorKeys;
    private cameraControls: Phaser.Cameras.Controls.FixedKeyControl;

    constructor() {
        super({
            key: "game"
        })
    }

    public preload() {
        this.load.image("tiles", "../assets/tiles.png");
        this.load.tilemapTiledJSON("level_1", "../assets/level_1.json");
        this.load.tilemapTiledJSON("level_2", "../assets/level_2.json");
    }

    public create() {
        this.square = this.add.rectangle(400, 400, 100, 100, 0xFFFFFF);
        this.exampleText = this.add.text(10, 10, "Hi Everybody", { font: '16px Courier', fill: '#00ff00' });
        this.game.input.mouse.capture = true;
        this.inventoryKey = this.input.keyboard.addKey("I");
        this.cursorKeys = this.input.keyboard.createCursorKeys();

        const map: Phaser.Tilemaps.Tilemap = this.make.tilemap({ key: 'level_1' });
        const tileset: Phaser.Tilemaps.Tileset = map.addTilesetImage('tileset', 'tiles');
        map.createStaticLayer("Map", tileset, 0, 0);

        const camera = this.cameras.main;
        camera.setBounds(0, 0, map.widthInPixels, map.heightInPixels);

        this.cameraControls = new Phaser.Cameras.Controls.FixedKeyControl({
            camera: camera,
            left: this.cursorKeys.left,
            right: this.cursorKeys.right,
            up: this.cursorKeys.up,
            down: this.cursorKeys.down,
            speed: 0.5
        });
    }

    public update(time: number, delta: number) {
        if (Phaser.Input.Keyboard.JustDown(this.inventoryKey)) {
            this.scene.switch("inventory");
            console.log("Switch to inventory.");
        }

        this.cameraControls.update(delta);

        //if (this.input.mouse.onMouseDown()) this.exampleActive = !this.exampleActive;

        if (this.exampleActive) this.exampleText.setAlpha(1);
        else this.exampleText.setAlpha(0);

        if (this.cursorKeys.up.isDown && !this.cursorKeys.down.isDown) this.square.y -= 10;
        if (this.cursorKeys.down.isDown && !this.cursorKeys.up.isDown) this.square.y += 10;
        if (this.cursorKeys.left.isDown && !this.cursorKeys.right.isDown) this.square.x -= 10;
        if (this.cursorKeys.right.isDown && !this.cursorKeys.left.isDown) this.square.x += 10;
    }
}
