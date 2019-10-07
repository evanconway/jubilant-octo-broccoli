import LevelLoader from "../levels/LevelLoader";

export default class WinScene extends Phaser.Scene {

    constructor() {
        super({
            key: "win"
        });
    }

    public create() {
        console.log("yay");
        LevelLoader.asyncLoadTilemap(this, "assets/win.json").then((tileMap) => {
            this.add.text(64, 200, "Thanks for playing!", {color: "#fff"});
            this.add.text(64, 220, "That's all there is :)", {color: "#fff"});
            this.add.text(64, 240, "By Erty Seidohl, Ryan McVerry, Evan Conway, and Vince Gaviria", {color: "#fff"});
            this.add.text(64, 260, "Made for Ludum Dare #45 (ldjam.com)", {color: "#fff"});
        });
    }
}