export class LevelData {
    public startingInventory: string;
    public validWords: Set<string>;
    public textAreas: Map<string, string>;
}

export const LEVEL_DATA: LevelData[] = [
    {
        startingInventory: "nothing",
        validWords: new Set<string>(["nog", "hog", "hot", "hit", "thin", "ingot"]),
        textAreas: new Map<string, string>([
            ["4,6", "This icy wall needs some heat to melt away!"],
            ["10,6", "If you could lose some weight, you might be able to slip between the bars..."],
            ["3,24", "The mummy's coffin is missing a golden bar. Perhaps you can replace it..."]
        ])
    },
    {
        startingInventory: "emptyvoid",
        validWords: new Set<string>(['vomit','tome','timed','tidy','pot','pie','move','mopey','imp','deity','die']),
        textAreas: new Map<string, string>([
          
        ])
    }
];