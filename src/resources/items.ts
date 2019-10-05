import { BaseActor, Properties } from  "./actors"

export abstract class Item extends BaseActor {}

class Sword extends Item {

    constructor() {
        super(new Properties(5, 0, 0, 0));
    }
}


export let AllItems: {[s: string]: Item} = {
    // "sword": () => new Sword() ,
}