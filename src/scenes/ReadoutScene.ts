import {TEXT_AREA_HEIGHT_PX} from '../constants';

export default class ReadoutScene extends Phaser.Scene {
    private textBuffer: string[] = [];
    private textArea: Phaser.GameObjects.Text;

    constructor() {
        super({
            key: "readout"
        })
    }

    public write(text: string): void {
        this.textBuffer.push(text);
        this.textArea.setText(this.textBuffer.join("\n"));
    }

    public create() {
        this.cameras.main.setViewport(
            0,
            this.game.canvas.height - TEXT_AREA_HEIGHT_PX,
            this.game.canvas.width,
            TEXT_AREA_HEIGHT_PX
        );
        this.textArea = this.add.text(0, 0, "", {color: "#fff"});
        this.textArea.setFixedSize(this.game.canvas.width, TEXT_AREA_HEIGHT_PX);
        this.textArea.setWordWrapWidth(this.game.canvas.width, true);
    }
}