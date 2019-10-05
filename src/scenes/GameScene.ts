export default class GameScene extends Phaser.Scene {
    private square: Phaser.GameObjects.Rectangle;

    constructor() {
        super({
            key: "game"
        })
    }

    public create() {
      this.square = this.add.rectangle(400, 400, 100, 100, 0xFFFFFF);

      this.input.on('keydown', function(event: KeyboardEvent) {
          console.log("keydown")
        if(event.key == "i") {
            this.scene.switch("inventory")
        }
      });
    }

    public update() {
        const cursorKeys = this.input.keyboard.createCursorKeys();

        if (cursorKeys.up.isDown) {
            this.square.y -= 10;
        } else if (cursorKeys.down.isDown) {
            this.square.y += 10;
        }
    }
  }
