import GameScene from "./GameScene";
import LevelLoader from "../levels/LevelLoader";

const LEFTX: number = 100;
const STARTY: number = 100;
const LINE_HEIGHT: number = 50;

export default class MenuScene extends Phaser.Scene {
    private isLoaded: boolean = false;
    private loadText: Phaser.GameObjects.Text;

    constructor() {
        super({
            key: "menu"
        })
    }

    public preload() {
        this.load.image("tiles", "../assets/tiles.png");
        this.load.spritesheet("tiles_sprites", "../assets/tiles.png", {
            frameWidth: 32, frameHeight: 32
        });
        this.load.spritesheet('letters', 'assets/letters.png', { frameWidth: 32, frameHeight: 32 });
        this.load.spritesheet('letter_holder', 'assets/letter_holder.png', { frameWidth: 45, frameHeight: 45 });

        this.loadText = this.add.text(LEFTX, STARTY + LINE_HEIGHT, "Loading:  0%");

        this.load.on('progress', (value: any) => {
            if (this.loadText) {
                this.loadText.setText(`Loading: ${value * 100}%`);
            }
        });
        
        this.load.on('complete', () => {
            this.isLoaded = true;
            if (this.loadText) {
                this.loadText.setText(`Loaded! Click to begin.`);
            }
        });
    }

    public create() {
        LevelLoader.asyncLoadTilemap(this, "assets/menu.json").then((tileMap) => {
            let i = 0;
            this.add.text(LEFTX, STARTY + i++ * LINE_HEIGHT, "Use the arrow keys to move.");
            this.add.text(LEFTX, STARTY + i++ * LINE_HEIGHT, "Type to use letters from your inventory.");
            this.add.text(LEFTX, STARTY + i++ * LINE_HEIGHT, "`'Backspace' puts a letter back.`");
            this.add.text(LEFTX, STARTY + i++ * LINE_HEIGHT, "Click or press a key to start.");
        });

        this.input.on('pointerup', () => {
            if (this.isLoaded) {
                this.scene.switch('game');
            }
        });

        this.input.keyboard.on('keydown', (event: any) => {
            if (!this.isLoaded) {
                return;
            }
            this.scene.switch('game');
            let gameScene = this.scene.get('game') as GameScene;
            switch(event.keyCode) {
                case Phaser.Input.Keyboard.KeyCodes.SEVEN:
                    gameScene.nextLevel();
                    /* falls through */
                case Phaser.Input.Keyboard.KeyCodes.SIX:
                    gameScene.nextLevel();
                    /* falls through */
                case Phaser.Input.Keyboard.KeyCodes.FIVE:
                    gameScene.nextLevel();
                    /* falls through */
                case Phaser.Input.Keyboard.KeyCodes.FOUR:
                    gameScene.nextLevel();
                    /* falls through */
                case Phaser.Input.Keyboard.KeyCodes.THREE:
                    gameScene.nextLevel();
                    /* falls through */
                case Phaser.Input.Keyboard.KeyCodes.TWO:
                    gameScene.nextLevel();
                    /* falls through */
                case Phaser.Input.Keyboard.KeyCodes.ONE:
                    /* falls through */
                default:
                    /* pass */
            }
        })
        
    }

}