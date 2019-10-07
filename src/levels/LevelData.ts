export class LevelData {
    public startingInventory: string;
    public validWords: Set<string>;
    public textAreas: Map<string, string>;
}

export const LEVEL_DATA: LevelData[] = [
    {
        startingInventory: "nothing",
        validWords: new Set<string>(["nog", "hog", "g", "hot", "hit", "thin"]),
        textAreas: new Map<string, string>([
            ["4,6", "This icy wall needs some heat to melt away!"],
            ["10,6", "If you could lose some weight, you might be able to slip between the bars..."]
        ])
    },
    {
        startingInventory: "emptyvoid",
        validWords: new Set<string>(['vomit','tome','timed','tidy','pot','pie','move','mopey','imp','deity','die']),
        textAreas: new Map<string, string>([
          
        ])
    }
];