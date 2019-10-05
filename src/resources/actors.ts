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

function get_token_set(name: string): Set<string> {
    return  new Set(name.split(" "))    
}

export function get_item(name: string): Actor<Item> | null {
    let tokens: Set<string> = get_token_set(name)

    var item: Item | null;
    let mods: Modifier<Item>[] = [];

    for (let token of tokens)
    {
        let is_item = AllItems[token];
        if (is_item) {
            if (item !== null) {
                return null;
            }
            item = is_item;
            tokens.delete(token);
        }
    }

    if (item === null) {
        return null;
    }

    for(let token of tokens)
    {
        let is_mod = AllModifiers[token];
        if (is_mod) {
            mods.push(is_mod)
        } else {
            return null;
        }
    }
    
    return new Actor<Item>(item, mods);
} 
