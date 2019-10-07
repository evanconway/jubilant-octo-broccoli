import { INVENTORY_HEIGHT_PX, READOUT_WIDTH_PX } from '../constants';

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
            this.game.canvas.width - READOUT_WIDTH_PX,
            0,
            READOUT_WIDTH_PX,
            this.game.canvas.height - INVENTORY_HEIGHT_PX
        );
        this.textArea = this.add.text(0, 0, "", {color: "#fff"});
        this.textArea.setFixedSize(READOUT_WIDTH_PX, this.game.canvas.height - INVENTORY_HEIGHT_PX);
        this.textArea.setWordWrapWidth(READOUT_WIDTH_PX, true);
    }
}