import { BaseActor } from  "./actors"

export abstract class Item extends BaseActor {}

class Sword extends Item {
    weight: 5
    reach: 1
    damage: 1
}


export let AllItems = {
    "sword": Sword,
}