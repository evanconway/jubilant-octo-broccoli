export default class LetterTile extends Phaser.GameObjects.Sprite {
    private letter: string;
    private clicked: boolean = false;

    constructor(scene: Phaser.Scene, x: number, y: number, letter: string) {
        super(scene, x, y, 'letters', letter.charCodeAt(0) == 32 ? 26 : letter.charCodeAt(0) - 97);
        this.letter = letter;//.valueOf(0); // cuts off anything but first char
        this.setInteractive();
    }

    public getLetter(): string {
        return this.letter;
    }
}