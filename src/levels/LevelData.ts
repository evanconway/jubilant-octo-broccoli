export class LevelData {
    public startingInventory: string;
    public validWords: Set<string>;
    public textAreas: Map<string, string>;
}

export const LEVEL_DATA: LevelData[] = [
    {
        startingInventory: "nothing",
        validWords: new Set<string>(["hog", "hot", "hit", "thin", "ingot", "light", "night"]),
        textAreas: new Map<string, string>([
            
        ])
    },
    {
        startingInventory: "emptyvoid",
        validWords: new Set<string>(['vomit','tome','timed','tidy','pot','pie','move','mopey','imp','deity','die']),
        textAreas: new Map<string, string>([
          
        ])
    }
];