import GameScene from '../scenes/GameScene';
import { GameSprite } from './GameSprite';

export class TextArea extends GameSprite {
    private text: string;

    public isCollidable(): boolean {
        return false;
    }

    public recItem(item: string): void {
        // pass
    }

    public setText(text: string): void {
        this.text = text;
    }

    public getText(): string {
        if (!this.text) {
            return `NO TEXT SET (${this.gridX}, ${this.gridY})`;
        }
        return this.text;
    }
}
