import {BaseActor} from "./actors"

export type Modifier = (actor: BaseActor) => void;

function thin(actor: BaseActor): void {
    actor.weight /= 2
    actor.size /= 2
    actor.speed *= 2
}

function short(actor: BaseActor): void {
    actor.height /= 2
    actor.weight /= 2
}

export let AllModifiers = {
    "thin": thin,
    "short": short,
}