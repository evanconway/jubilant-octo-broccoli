import {BaseActor} from "./actors"
import {Modifier, AllModifiers} from "./modifers"
import {AllItems, Item} from "./items"

function get_token_set(name: string): Set<string> {
    return new Set(name.split(" "))
}

function match<T extends BaseActor>(token_set: Set<string>, my_map: any ): T | null {
    var ret: T = null;   
    for (let token of token_set) {
        ret = my_map.get(token);
        if (ret) {
            token_set.delete(token);
            return ret;
        }
    }
    return null;
}

function match_mods(token_set: Set<string>): Modifier[] {
    const mods: Modifier[] = [];
    for(let token of token_set)
    {
        let is_mod = AllModifiers.get(token);
        if (is_mod) {
            mods.push(is_mod)
            token_set.delete(token);
        }
    }
    return mods;
}


export function get_item(name: string): Item | null {
    let token_set: Set<string> = get_token_set(name)
    var item = match<Item>(token_set, AllItems);

    if (!item) {
      return null;
    }

    var mods = match_mods(token_set);

    if(token_set.size) {
      return null;
    }

    item.setModifiers(mods);
    return item;
  }
