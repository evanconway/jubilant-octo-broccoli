const TEXT_DISPLAY_WINDOW_HEIGHT: number = 200;

export default class GameScene extends Phaser.Scene {
    private square: Phaser.GameObjects.Rectangle;
    private exampleText: Phaser.GameObjects.Text;
    private exampleActive: boolean = true;
    private inventoryKey: Phaser.Input.Keyboard.Key;
    private cursorKeys: Phaser.Types.Input.Keyboard.CursorKeys;
    private cameraControls: Phaser.Cameras.Controls.FixedKeyControl;
    private textDisplayWindow: Phaser.GameObjects.Text;
    private textDisplayBuffer: string[] = [];

    constructor() {
        super({
            key: "game"
        })
    }

    public preload() {
        this.load.image("tiles", "../assets/tiles.png");
        this.load.image("gate", "../assets/gate.png");
        this.load.tilemapTiledJSON("level_1", "../assets/level_1.json");
        this.load.tilemapTiledJSON("level_2", "../assets/level_2.json");
    }

    public writeText(text: string) {
        this.textDisplayBuffer.push(text);
        this.textDisplayWindow.setText(this.textDisplayBuffer.join("\n"));
    }

    public create() {
        this.square = this.add.rectangle(400, 400, 100, 100, 0xFFFFFF);
        this.exampleText = this.add.text(10, 10, "Hi Everybody", { font: '16px Courier', fill: '#00ff00' });
        this.game.input.mouse.capture = true;
        this.inventoryKey = this.input.keyboard.addKey("I");
        this.cursorKeys = this.input.keyboard.createCursorKeys();

        const map: Phaser.Tilemaps.Tilemap = this.make.tilemap({ key: 'level_1' });
        const tileset: Phaser.Tilemaps.Tileset = map.addTilesetImage('tiles', 'tiles');

        // not working
        this.textDisplayWindow = this.add.text(0, this.game.canvas.height - TEXT_DISPLAY_WINDOW_HEIGHT, "hey");

        this.writeText("hello");
        this.writeText("world");
        
        map.createStaticLayer("Map", tileset, 0, 0);

        map.createFromObjects("Objects", 2, { key: "gate" });

        const camera = this.cameras.main;
        camera.setBounds(0, 0, map.widthInPixels, map.heightInPixels);
        camera.setViewport(0, 0, this.game.canvas.width, this.game.canvas.height - TEXT_DISPLAY_WINDOW_HEIGHT);

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
