import { Modifier, AllModifiers } from "./modifers"
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

    resetProperties() {
      this.modifiedProperties.apply(this.defaultProperties);
    }

    updateModifiedProperties() {
      this.resetProperties();
      this.modifiers.forEach((modifier) => modifier(this.modifiedProperties))
    }
}

function get_token_set(name: string): Set<string> {
    return  new Set(name.split(" "))
}

// export function get_item(name: string): <Item> | null {
//     let tokens: Set<string> = get_token_set(name)

//     var item: Item | null;
//     let mods: Modifier<Item>[] = [];

//     for (let token of tokens)
//     {
//         let is_item = AllItems[token];
//         if (is_item) {
//             if (item !== null) {
//                 return null;
//             }
//             item = is_item;
//             tokens.delete(token);
//         }
//     }

//     if (item === null) {
//         return null;
//     }

//     for(let token of tokens)
//     {
//         let is_mod = AllModifiers[token];
//         if (is_mod) {
//             mods.push(is_mod)
//         } else {
//             return null;
//         }
//     }

//     return new Actor<Item>(item, mods);
// }
