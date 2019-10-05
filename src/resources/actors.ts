import { Modifier } from "./modifers"

export class BaseActor {
    weight: number;
    speed: number;
    size: number;
    height: number;

    modifiers: Modifier[]
}   


export function update_actors(actors: BaseActor[]): void {
    actors.forEach(
        (actor) => actor.modifiers.forEach(
            (modifier) => modifier(actor)
        )
    )
}