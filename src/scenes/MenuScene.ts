export default class MenuScene extends Phaser.Scene {

    constructor() {
        super({
            key: "menu"
        })
    }

    public create() {
        this.add.text(10, 10, "Menu");
    }
}