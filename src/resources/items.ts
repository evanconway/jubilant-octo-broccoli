import { BaseActor, Properties } from  "./actors"

export abstract class Item extends BaseActor {}

export class Sword extends Item {
    constructor() {
        super(new Properties(5, 0, 0, 0));
    }
}

export class Key extends Item {
    constructor() {
        super(new Properties(5, 0, 0, 0));
    }
}

export const AllItems: Map<string, Item> = new Map<string, Item>([
    ["gey", new Key()],
    ["sword", new Sword()],
    ["nog", new Sword()]
]);

export const isValidItem = (word: string): boolean => {
    return AllItems.has(word);
}
