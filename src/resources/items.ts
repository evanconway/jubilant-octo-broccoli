import { BaseActor, Properties } from  "./actors"

export abstract class Item extends BaseActor {}

class Sword extends Item {
    constructor() {
        super(new Properties(5, 0, 0, 0));
    }
}

export const AllItems: Map<string, Item> = new Map<string, Item>([
    ["sword", new Sword()]
]);

export const isValidItem = (word: string): boolean => {
    return AllItems.has(word);
} 