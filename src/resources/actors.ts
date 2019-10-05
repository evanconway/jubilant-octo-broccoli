import { Modifier } from "./modifers"

export class BaseActor {
    weight: number = 0;
    speed: number = 0;
    size: number = 0;
    height: number = 0;
}

export function clone<T extends BaseActor>(actor: T): T {
    return {...actor};
}

export function actor_apply_modifiers<T extends BaseActor>(actor: T, modifiers: Modifier<T>[]): T {
    modifiers.forEach((modifier) => actor = modifier(actor))
    return actor;
}