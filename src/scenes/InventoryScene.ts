import LetterTile from "../LetterTile";
import { GameObjects } from "phaser";

const LETTER_SIZE: number = 42; // slightly bigger than sprite width
enum LIST {
    INVENTORY,
    ITEM,
    SKILL,
    SPELL,
    SIZE // just used for size of enumerator
}

export default class InventoryScene extends Phaser.Scene {

    private inventoryKey: Phaser.Input.Keyboard.Key;
    /*
    Instead of having a different array variable for each list,
    we're just going to have one 2D array, where the first index
    is the list (unused, item, skill...) and the second index
    is the letter. Use the above enumerator to refer to the list.
    */
    private lists: Array<Array<LetterTile>> = new Array<Array<LetterTile>>();
    private listY: Array<number> = new Array<number>();
    private arraysX: number;

    constructor() {
        super({
            key: "inventory"
        })
    }

    public preload() {
        this.load.spritesheet('letters', 'assets/placeholder_letters.png', { frameWidth: 32, frameHeight: 32});
    }

    public create() {
        for (let i = 0; i < LIST.SIZE; i++) this.lists.push(new Array<LetterTile>());
        this.arraysX = 300;
        let yStart = 50;

        for (let i = 0, count = 0, dist = 3; i < LIST.SIZE; i++, count += dist) {
            this.listY.push(yStart + (LETTER_SIZE * count));
        }

        this.add.text(this.arraysX, this.listY[LIST.INVENTORY], "Inventory", { font: '16px Courier', fill: '#00ff00' });
        this.add.text(this.arraysX, this.listY[LIST.ITEM], "Item", { font: '16px Courier', fill: '#00ff00' });
        this.add.text(this.arraysX, this.listY[LIST.SKILL], "Skill", { font: '16px Courier', fill: '#00ff00' });
        this.add.text(this.arraysX, this.listY[LIST.SPELL], "Spell", { font: '16px Courier', fill: '#00ff00' });
        
        this.inventoryKey = this.input.keyboard.addKey("I");

        this.addLetters("you have nothing");

        this.input.on('drag', (pointer: Phaser.Input.Pointer, gameObject: Phaser.GameObjects.Sprite, dragX: number, dragY: number) => {
            gameObject.x = dragX;
            gameObject.y = dragY;

        });

        this.input.on('dragend', (pointer: Phaser.Input.Pointer, gameObject: Phaser.GameObjects.Sprite) => {
            // determine index of list the letter was dragged to.
            let listIndex = LIST.SPELL; // for spell list.
            if (gameObject.y <= this.listY[LIST.SPELL]) listIndex = LIST.SKILL;
            if (gameObject.y <= this.listY[LIST.SKILL]) listIndex = LIST.ITEM;
            if (gameObject.y <= this.listY[LIST.ITEM]) listIndex = LIST.INVENTORY;
            /*
            Now we have to find the index where we will add the dragged letter.
            The splice function of arrays adds new elements at the specified index and pushes everything else back. It is like the
            addBefore of a list. This means if we want to add to the start of the array, we splice at index 0. But to add to the end 
            of the array, we'll need to use push(). We'll set the insertIndex to -1, and if it is unchanged by our check loop, we 
            know that means we need to use push().
            */
            let insertIndex = -1;

            for (let i = 0; i < this.lists[listIndex].length; i++) {
                let checkX = this.lists[listIndex][i].x;
                if (checkX > gameObject.x) {
                    insertIndex = i;
                    i = this.lists[listIndex].length;
                }
            }
            if (insertIndex >= 0) this.lists[listIndex].splice(insertIndex, 0, gameObject as LetterTile);
            else {
                this.lists[listIndex].push(gameObject as LetterTile);
                insertIndex = this.lists[listIndex].length - 1;
            }
            /*
            Now that we have added the dragged letter to the correct list and position, we need to remove it 
            from it's previous place.
            */
           this.removeOther(gameObject as LetterTile, listIndex, insertIndex);
            this.updateLetterPositions();
        });
    }

    public update() {
        if (Phaser.Input.Keyboard.JustDown(this.inventoryKey)) {
            this.scene.switch("game");
            console.log("Switch to game.");
        }
    }

    public addLetters(newLetters: string) {
        for (let i = 0; i < newLetters.length; i++) {
            this.pushUnused(newLetters.charAt(i));
        }
    }

    private pushUnused(char: string) {
        let temp = new LetterTile(this, 0, 0, char);
        this.add.existing(temp);
        this.input.setDraggable(temp);
        this.lists[LIST.INVENTORY].push(temp);
        this.updateLetterPositions();
    }

    // This may not be needed
    private addAt(listIndex: number, letterIndex: number, char: string) {
        if (listIndex >= 0 && listIndex < this.lists.length && letterIndex >= 0 && letterIndex < this.lists[listIndex].length) {
            let temp = new LetterTile(this, 0, 0, char);
            this .add.existing(temp);
            this.lists[listIndex].splice(letterIndex, 0, temp);
        }else console.log("addAt error, index out of bounds");
    }

    private removeAt(listIndex: number, letterIndex: number) {
        if (listIndex >= 0 && listIndex < this.lists.length && letterIndex >= 0 && letterIndex < this.lists[listIndex].length) {
            this.lists[listIndex].splice(letterIndex, 1);
        } else console.log("removeAt error, index out of bounds");
    }

    private updateLetterPositions() {
        for (let i = 0; i < this.lists.length; i++) {
            for (let k = 0; k < this.lists[i].length; k++) {
                this.lists[i][k].x = this.arraysX + (LETTER_SIZE * k) + LETTER_SIZE/2; // add half of letter size because sprite origin is center, center
                this.lists[i][k].y = this.listY[i] + LETTER_SIZE;
            }
        }
    }

    /*
    This function removes the given letter from lists, but only if it is NOT the element 
    at the given listIndex and letterIndex. We pass in the indexes of the new letter
    instead of the old because when we add the letter to its new position, the position
    of the old letter could change. This is simpler.
    */
    private removeOther(letter: LetterTile, listIndex: number, letterIndex: number) {
        let removed = false;
        for (let i = 0; i < this.lists.length; i++) {
            for (let k = 0; k < this.lists[i].length; k++) {
                let equal = this.lists[i][k] === letter;
                if (equal && !(i == listIndex && k == letterIndex)) {
                    this.removeAt(i, k);
                    k = this.lists[i].length;
                    removed = true;
                }
            }
            if (removed) i = this.lists.length;
        }
    }

    public getInventoryString(): string {
        let result: string = "";
        for (let i = 0; i < this.lists[LIST.INVENTORY].length; i++) {
            result += this.lists[LIST.INVENTORY][i].getLetter;
        }
        return result;
    }

    public getItemString(): string {
        let result: string = "";
        for (let i = 0; i < this.lists[LIST.ITEM].length; i++) {
            result += this.lists[LIST.ITEM][i].getLetter;
        }
        return result;
    }

    public getSkillString(): string {
        let result: string = "";
        for (let i = 0; i < this.lists[LIST.SKILL].length; i++) {
            result += this.lists[LIST.SKILL][i].getLetter;
        }
        return result;
    }

    public getSpellString(): string {
        let result: string = "";
        for (let i = 0; i < this.lists[LIST.SPELL].length; i++) {
            result += this.lists[LIST.SPELL][i].getLetter;
        }
        return result;
    }
}