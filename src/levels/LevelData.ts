export class LevelData {
    public startingInventory: string;
    public validWords: Set<string>;
    public textAreas: Map<string, string>;
}

export const LEVEL_DATA: LevelData[] = [
    {
        startingInventory: "none",
        validWords: new Set<string>(["neon", "one"]),
        textAreas: new Map<string, string>([
            ["4,4", "Into the guard you must move\n a riddle you will recieve\n if they, your answer, approve\n you may just get them to leave."]
        ])
    },
    {
        startingInventory: "nothing",
        validWords: new Set<string>(["hog", "hot", "hit", "thin", "ingot", "light", "night"]),
        textAreas: new Map<string, string>([
            ["7,8", "This tomb was created\nBy a teacher who hated\nMisspellings and errors\nNow go face those terrors!"]
        ])
    },
    {
        startingInventory: "emptyvoid",
        validWords: new Set<string>(['vomit','tome','timed','tidy','pot','pie','move','mopey','imp','deity','die']),
        textAreas: new Map<string, string>([
          
        ])
    },
];