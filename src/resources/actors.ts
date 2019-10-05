import { Modifier, AllModifiers } from "./modifers"
import {AllItems, Item} from "./items"

export class BaseActor {
    weight: number = 0;
    speed: number = 0;
    size: number = 0;
    height: number = 0;
}

export function clone<T extends BaseActor>(actor: T): T {
    return {...actor};
}

export class Actor<T extends BaseActor> {
    actor: T;
    modifiers: Modifier<T>[];

    constructor(actor: T, modifiers: Modifier<T>[]) {
        this.actor = actor;
        this.modifiers = modifiers;
    }

    public apply_modifiers(): T {
        let my_actor = clone(this.actor);
        this.modifiers.forEach((modifier) => my_actor = modifier(my_actor))
        return my_actor;
    }
}

export function get_item(name: string): Actor<Item> | null {

    let tokens: string[] = name.split(" ")    

    var item = null
    tokens.forEach(
        (token) => {
            let next_item = AllItems[token];
            if (next_item) {
                if (item !== null) {
                    return null;
                }
                item = next_item;
            }
        } 
    )
    if (item === null) {
        return null;
    }

    let mods: Modifier<Item>[] = []
    tokens.forEach(
        (token) => {
            let next_mod = AllModifiers[token]
            if (next_mod) {
                mods.push(next_mod)
            } else {
                return null;
            }
        }
    )
    
    return new Actor<Item>(item, mods);
} 


