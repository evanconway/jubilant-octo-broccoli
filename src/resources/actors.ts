import { Modifier, AllModifiers, isValidModifier } from "./modifers"
import {AllItems, Item} from "./items"

export class Properties {
  weight: number = 0;
  speed: number = 0;
  size: number = 0;
  height: number = 0;

  constructor(weight: number, speed: number, size: number, height: number) {
    this.weight = weight;
    this.speed = speed;
    this.size = size;
    this.height = height;
  }

  apply(properties: Properties): void {
    this.weight = properties.weight;
    this.speed = properties.speed;
    this.size = properties.size;
    this.height = properties.height;
  }
}

export class BaseActor {
    modifiers: Modifier[] = [];
    defaultProperties: Properties;
    modifiedProperties: Properties;

    constructor(defaultProperties: Properties) {
      this.defaultProperties = defaultProperties;
      this.modifiedProperties = defaultProperties;
    }

    setModifiers(modifers: Modifier[] = []) {
      this.modifiers = modifers;
    }

    resetProperties() {
      this.modifiedProperties.apply(this.defaultProperties);
    }

    updateModifiedProperties() {
      this.resetProperties();
      this.modifiers.forEach((modifier) => modifier(this.modifiedProperties))
    }
}

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

    if(token_set) {
      return null;
    }

    item.setModifiers(mods);
    return item;
  }
