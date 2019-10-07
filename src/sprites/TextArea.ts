import GameScene from '../scenes/GameScene';
import { GameSprite } from './GameSprite';
import { ItemResolutionResponse } from "../constants";

export class TextArea extends GameSprite {
    private text: string;

    public isCollidable(): boolean {
        return false;
    }

    public recItem(item: string): ItemResolutionResponse {
      return ItemResolutionResponse.NONE;
    }

    public setText(text: string): void {
        this.text = text;
    }

    public getText(): string {
        return "TODO";
    }
}
