import { Properties } from "./actors"

export type Modifier = (properties: Properties) => void;

function thin (properties: Properties): void {
    properties.weight = properties.weight / 2
    properties.size =  properties.size / 2
    properties.speed = properties.speed / 2
}

function short (properties: Properties): void {
    properties.height = properties.height / 2
    properties.weight = properties.weight / 2
}

function tall (properties: Properties): void {
    properties.height = properties.height * 2
    properties.weight = properties.weight * 2
}

function fat (properties: Properties): void {
    properties.height = properties.size * 2
    properties.weight = properties.weight * 2;
    properties.speed = properties.speed / 2
}

export const AllModifiers: Map<string, Modifier> = new Map<string, Modifier>([
    ["thin", thin],
    ["short", short],
    ["tall", tall],
    ["fat", fat],
]);

export const isValidModifier = (word: string): boolean => {
    return AllModifiers.has(word);
};