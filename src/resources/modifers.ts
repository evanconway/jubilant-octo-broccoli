import {BaseActor, clone} from "./actors"

export type Modifier<T extends BaseActor> = (actor: T) => T;

function thin<T extends BaseActor>(actor: T): T {
    let dest = clone(actor);

    dest.weight = actor.weight / 2
    dest.size =  actor.size / 2
    dest.speed = actor.speed / 2

    return dest
}

function short<T extends BaseActor>(actor: T): T {
    let dest = clone(actor);

    dest.height = actor.height / 2
    dest.weight = actor.weight / 2

    return dest;
}

function tall<T extends BaseActor>(actor: T): T {
    let dest = clone(actor);

    dest.height = actor.height * 2
    dest.weight = actor.weight * 2
    
    return dest;
}

function fat<T extends BaseActor>(actor: T): T {
    let dest = clone(actor);
    
    dest.height = actor.size * 2
    dest.weight = actor.weight * 2;
    dest.speed = actor.speed / 2

    return dest;
}

export let AllModifiers = {
    "thin": thin,
    "short": short,
    "tall": tall,
    "fat": fat,
}