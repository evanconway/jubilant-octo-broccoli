import GameScene from "./GameScene";

const LEFTX: number = 100;
const STARTY: number = 100;
const LINE_HEIGHT: number = 50;

export default class MenuScene extends Phaser.Scene {

    private menuKey: Phaser.Input.Keyboard.Key;

    constructor() {
        super({
            key: "menu"
        })
    }

    public create() {
        let i = 0;
        this.add.text(LEFTX, STARTY, "N O T H I N G");
        i++;
        this.add.text(LEFTX, STARTY + i++ * LINE_HEIGHT, "Use the arrow keys to move.");
        this.add.text(LEFTX, STARTY + i++ * LINE_HEIGHT, "Type to use letters from your inventory.");
        this.add.text(LEFTX, STARTY + i++ * LINE_HEIGHT, "'Backspace' puts a letter back.");
        this.add.text(LEFTX, STARTY + i++ * LINE_HEIGHT, "'Delete' puts all letters back.");
        this.add.text(LEFTX, STARTY + i++ * LINE_HEIGHT, "Press 'Escape' to begin.");
        this.add.text(LEFTX, STARTY + ++i * LINE_HEIGHT, "Good luck!");
        this.menuKey = this.input.keyboard.addKey("esc");
    }

    public update() {
        if (Phaser.Input.Keyboard.JustDown(this.menuKey)) {
            debugger;
            this.scene.switch("game");
        }
    }


}