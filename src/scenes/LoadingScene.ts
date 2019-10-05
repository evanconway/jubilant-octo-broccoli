export default class LoadingScene extends Phaser.Scene {

    constructor() {
        super({
            key: "loading"
        })
    }

    public create() {
        this.add.text(10, 10, "Loading");
    }
}