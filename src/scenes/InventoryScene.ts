import LetterTile from "../LetterTile";
import { GameObjects } from "phaser";
import { INVENTORY_HEIGHT_PX, READOUT_WIDTH_PX } from '../constants';
import GameScene from "./GameScene";

const LETTER_SIZE: number = 42; // slightly bigger than sprite width
const HIGHLIGHT_ALPHA: number = 1;
const HIGHLIGHT_RED: number = 0x880000;
const HIGHLIGHT_GREEN: number = 0x008800;
const MARGIN_LEFT: number = 0; // todo
const MARGIN_VERTICAL: number = 10;

enum LIST {
    INVENTORY,
    ITEM,
    //SKILL,
    //SPELL,
    SIZE // just used for size of enumerator
}

export default class InventoryScene extends Phaser.Scene {

    /*
    Instead of having a different array variable for each list,
    we're just going to have one 2D array, where the first index
    is the list (unused, item, skill...) and the second index
    is the letter. Use the above enumerator to refer to the list.

    Update: We've decided to only have one "word" slot. For now
    we're just changing our 2D array so it only contains 2 arrays.
    This isn't very elegant but it's a quick fix that works.
    */
    private lists: Array<Array<LetterTile>> = new Array<Array<LetterTile>>();
    private listY: Array<number> = new Array<number>();
    private highlights: Array<Phaser.GameObjects.Rectangle> = new Array<Phaser.GameObjects.Rectangle>();

    // We're creating an array of key objects to detect keyboard input.
    private keyboard: Phaser.Input.Keyboard.Key[] = new Array<Phaser.Input.Keyboard.Key>();
    private deleteKey: Phaser.Input.Keyboard.Key;
    private clearAllKey: Phaser.Input.Keyboard.Key;
    private spaceKey : Phaser.Input.Keyboard.Key;

    private gameScene: GameScene;

    constructor() {
        super({
            key: "inventory"
        })
    }

    public preload() {
        this.load.spritesheet('letters', 'assets/letters.png', { frameWidth: 32, frameHeight: 32});
    }

    public create() {
        this.gameScene = this.scene.get("game") as GameScene;

        for (let i = 0; i < LIST.SIZE; i++) this.lists.push(new Array<LetterTile>());

        for (let i = 0, count = 0, dist = 3; i < LIST.SIZE; i++, count += dist) {
            this.listY.push(MARGIN_VERTICAL + (LETTER_SIZE * count));
            this.highlights.push(new Phaser.GameObjects.Rectangle(this, MARGIN_LEFT, this.listY[i] + LETTER_SIZE, 0, LETTER_SIZE));
            this.highlights[i].depth -= 1;
            this.add.existing(this.highlights[i]);
        }

        this.add.text(MARGIN_LEFT, this.listY[LIST.INVENTORY], "Inventory (press spacebar to scramble)", { font: '16px Courier', fill: '#00ff00' });
        this.add.text(MARGIN_LEFT, this.listY[LIST.ITEM], "Item", { font: '16px Courier', fill: '#00ff00' });

        this.addLetters("nothing");

        // create our "keyboard". Add key objects for each key. Also make delete key.
        for (let i = 0; i < 26; i++) {
            this.keyboard.push(this.input.keyboard.addKey(i + 65));
        }
        this.deleteKey = this.input.keyboard.addKey("backspace");
        this.clearAllKey = this.input.keyboard.addKey("delete");
        this.spaceKey = this.input.keyboard.addKey("space");

        this.cameras.main.setViewport(
            0,
            this.game.canvas.height - INVENTORY_HEIGHT_PX,
            this.game.canvas.width,
            INVENTORY_HEIGHT_PX
        );

        // These will be deleted once the keyboard is fully implemented.
        this.input.on('drag', (pointer: Phaser.Input.Pointer, gameObject: Phaser.GameObjects.Sprite, dragX: number, dragY: number) => {
            gameObject.x = dragX;
            gameObject.y = dragY;
        });
        this.input.on('dragend', (pointer: Phaser.Input.Pointer, gameObject: Phaser.GameObjects.Sprite) => {
            // determine index of list the letter was dragged to.
            //let listIndex = LIST.SPELL; // for spell list.
            let listIndex = LIST.ITEM; // for spell list.
            //if (gameObject.y <= this.listY[LIST.SPELL]) listIndex = LIST.SKILL;
            //if (gameObject.y <= this.listY[LIST.SKILL]) listIndex = LIST.ITEM;
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
            this.setHighlights();
        });
    }

    public update() {
        // Grab typing input for A to Z
        for (let i = 0; i < this.keyboard.length; i++) {
            let charCode = this.keyboard[i].keyCode;
            let charString = String.fromCharCode(charCode);
            let letter = null;
            // if key is pressed and the letter of that key is in the inventory (is not null)
            if (Phaser.Input.Keyboard.JustDown(this.keyboard[i]) && (letter = this.listTakeLetter(LIST.INVENTORY, charString)) != null) {
                this.lists[LIST.ITEM].push(letter);
                this.updateLetterPositions();
                this.setHighlights();
            }
        }
        if (Phaser.Input.Keyboard.JustDown(this.deleteKey)) {
          if (this.gameScene.isValidWord(this.getItemString())) {
            this.putBackAllLetters();
          } else {
            this.putBackLastLetter();
          }
        } else if (Phaser.Input.Keyboard.JustDown(this.clearAllKey) && this.lists[LIST.ITEM].length > 0) {
          this.putBackAllLetters();
        } else if (Phaser.Input.Keyboard.JustDown(this.spaceKey)) {
          this.scrambleInventoryLetters();
        }
    }

    /* Put back last letter from current "item" and puts it back in inventory */
    private putBackLastLetter() {
      if (this.lists[LIST.ITEM].length > 0) {
        let last = this.lists[LIST.ITEM].length - 1;
        this.lists[LIST.INVENTORY].push(this.lists[LIST.ITEM][last]);
        this.lists[LIST.ITEM].splice(last, 1);
        this.updateLetterPositions();
        this.setHighlights();
      }
    }

    /* Put back all letters from current "item" and puts them back in inventory */
    private putBackAllLetters() {
        for (let i = this.lists[LIST.ITEM].length - 1; i >= 0; i--) {
            this.lists[LIST.INVENTORY].push(this.lists[LIST.ITEM][i]);
            this.lists[LIST.ITEM].splice(i, 1);
        }
        this.updateLetterPositions();
        this.setHighlights();
    }

    private scrambleInventoryLetters() {
        const inventoryList = this.lists[LIST.INVENTORY];
        for (let i = inventoryList.length - 1; i >= 0; i--) {
            const randIndex = Math.floor(Math.random() * Math.floor(i));
            const currentLetter = inventoryList[i];
            inventoryList[i] = inventoryList[randIndex];
            inventoryList[randIndex] = currentLetter;
        }
        this.updateLetterPositions();
        this.setHighlights();
    }

    /*
    If the list has the given letter, it returns that tile and removes it from that list.
    */
    private listTakeLetter(listIndex: number, char: string): LetterTile | null {
        let result = null;
        for (let i = 0; i < this.lists[listIndex].length; i++) {
            let listLetter = this.lists[listIndex][i].getLetter();
            char = char.toLowerCase();
            if (listLetter === char) {
                result = this.lists[listIndex][i];
                this.lists[listIndex].splice(i, 1);
                i = this.lists[listIndex].length;
            }
        }
        return result;
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
                this.lists[i][k].x = MARGIN_LEFT + (LETTER_SIZE * k) + LETTER_SIZE/2; // add half of letter size because sprite origin is center, center
                this.lists[i][k].y = this.listY[i] + LETTER_SIZE;
            }
    // Ellery's first code:
        }//  >? om mki
    } // v  '/ '

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

    private setHighlights() {
        let checkString: string = this.getItemString();
        for (let i = 1; i < this.lists.length; i++) { // start at 1 to ignore inventory
            checkString = this.getListString(i);
            let valid: boolean = this.gameScene.isValidWord(checkString);
            this.highlights[i].width = checkString.length * LETTER_SIZE;
            if (valid) {
                this.highlights[i].setFillStyle(HIGHLIGHT_GREEN, HIGHLIGHT_ALPHA);
            } else {
                this.highlights[i].setFillStyle(HIGHLIGHT_RED, HIGHLIGHT_ALPHA);
            }
        }
    }

    public getListString(listIndex: number): string {
        let result: string = "";
        for (let i = 0; i < this.lists[listIndex].length; i++) {
            result += this.lists[listIndex][i].getLetter();
        }
        return result;
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
            result += this.lists[LIST.ITEM][i].getLetter();
        }
        return result;
    }
}
