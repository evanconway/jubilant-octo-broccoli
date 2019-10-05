import LetterTile from "../LetterTile";

const LETTER_SIZE: number = 42; // slightly bigger than sprite width

export default class InventoryScene extends Phaser.Scene {

    private inventoryKey: Phaser.Input.Keyboard.Key;
    private unused: Array<LetterTile> = new Array<LetterTile>();
    private item: Array<LetterTile> = new Array<LetterTile>();
    private skill: Array<LetterTile> = new Array<LetterTile>();
    private spell: Array<LetterTile> = new Array<LetterTile>();
    private arraysX: number;
    private inventoryY: number;
    private itemY: number;
    private skillY: number;
    private spellY: number;

    constructor() {
        super({
            key: "inventory"
        })
    }

    public preload() {
        this.load.spritesheet('letters', 'assets/placeholder_letters.png', { frameWidth: 32, frameHeight: 32});
    }

    public create() {
        let i = 0;
        let dist = 3;
        this.arraysX = 300;
        let yStart = 50;
        this.inventoryY = yStart + (LETTER_SIZE * (i += dist));
        this.itemY = yStart + (LETTER_SIZE * (i += dist));
        this.skillY = yStart + (LETTER_SIZE * (i += dist));
        this.spellY = yStart + (LETTER_SIZE * (i += dist));
        this.add.text(this.arraysX, this.inventoryY, "Inventory", { font: '16px Courier', fill: '#00ff00' });
        this.add.text(this.arraysX, this.itemY, "Item", { font: '16px Courier', fill: '#00ff00' });
        this.add.text(this.arraysX, this.skillY, "Skill", { font: '16px Courier', fill: '#00ff00' });
        this.add.text(this.arraysX, this.spellY, "Spell", { font: '16px Courier', fill: '#00ff00' });
        
        this.inventoryKey = this.input.keyboard.addKey("I");

        this.pushUnused("y");
        this.pushUnused("o");
        this.pushUnused("u");
        this.pushUnused(" ");
        this.pushUnused("h");
        this.pushUnused("a");
        this.pushUnused("v");
        this.pushUnused("e");
        this.pushUnused(" ");
        this.pushUnused("n");
        this.pushUnused("o");
        this.pushUnused("t");
        this.pushUnused("h");
        this.pushUnused("i");
        this.pushUnused("n");
        this.pushUnused("g");

        this.input.on('drag', function (pointer, gameObject, dragX, dragY) {
            console.log("Dragged.");
            gameObject.x = dragX;
            gameObject.y = dragY;

        });


    }

    public update() {
        
        if (Phaser.Input.Keyboard.JustDown(this.inventoryKey)) {
            this.scene.switch("game");
            console.log("Switch to game.");
        }
    }

    public addLetter(char: string) {
        this.pushUnused(char);
    }

    private pushUnused(char: string) {
        let temp = new LetterTile(this, 0, 0, char);
        this.add.existing(temp);
        this.input.setDraggable(temp);
        this.unused.push(temp);
        this.updateLetterPositions();
    }

    private addAtUnused(index: number, char: string) {
        if (index >= 0 && index < this.unused.length) {
            let temp = new LetterTile(this, 0, 0, char);
            this.add.existing(temp);
            this.unused.splice(index, 0, temp);
        } else console.log("addAtUnused error, index out of bounds");
    }

    private removeAtUnused(index: number) {
        if (index >= 0 && index < this.unused.length) {
            this.unused.splice(index, 1);
        } else console.log("removeAtUnused error, index out of bounds");
    }

    private addAtItem(index: number, char: string) {
        if (index >= 0 && index < this.unused.length) {
            let temp = new LetterTile(this, 0, 0, char);
            this.add.existing(temp);
            this.item.splice(index, 0, temp);
        } else console.log("addAtUnused error, index out of bounds");
    }

    private removeAtItem(index: number) {
        if (index >= 0 && index < this.unused.length) {
            this.item.splice(index, 1);
        } else console.log("removeAtUnused error, index out of bounds");
    }

    private addAtSkill(index: number, char: string) {
        if (index >= 0 && index < this.unused.length) {
            let temp = new LetterTile(this, 0, 0, char);
            this.add.existing(temp);
            this.skill.splice(index, 0, temp);
        } else console.log("addAtUnused error, index out of bounds");
    }

    private removeAtSkill(index: number) {
        if (index >= 0 && index < this.unused.length) {
            this.skill.splice(index, 1);
        } else console.log("removeAtUnused error, index out of bounds");
    }

    private addAtSpell(index: number, char: string) {
        if (index >= 0 && index < this.unused.length) {
            let temp = new LetterTile(this, 0, 0, char);
            this.add.existing(temp);
            this.spell.splice(index, 0, temp);
        } else console.log("addAtUnused error, index out of bounds");
    }

    private removeAtSpell(index: number) {
        if (index >= 0 && index < this.unused.length) {
            this.spell.splice(index, 1);
        } else console.log("removeAtUnused error, index out of bounds");
    }

    private updateLetterPositions() {
        for (let i = 0; i < this.unused.length; i++) {
            this.unused[i].x = this.arraysX + (LETTER_SIZE * i) + LETTER_SIZE/2; // add half of letter size because sprite origin is center, center
            this.unused[i].y = this.inventoryY + LETTER_SIZE;
        }

        for (let i = 0; i < this.item.length; i++) {
            this.item[i].x = this.arraysX + (LETTER_SIZE * i) + LETTER_SIZE/2; // add half of letter size because sprite origin is center, center
            this.item[i].y = this.itemY + LETTER_SIZE;
        }

        for (let i = 0; i < this.skill.length; i++) {
            this.skill[i].x = this.arraysX + (LETTER_SIZE * i) + LETTER_SIZE/2; // add half of letter size because sprite origin is center, center
            this.skill[i].y = this.skillY + LETTER_SIZE;
        }

        for (let i = 0; i < this.spell.length; i++) {
            this.spell[i].x = this.arraysX + (LETTER_SIZE * i) + LETTER_SIZE/2; // add half of letter size because sprite origin is center, center
            this.spell[i].y = this.spellY + LETTER_SIZE;
        }
    }
}