export class LevelData {
    public startingInventory: string;
    public validWords: Set<string>;
    public textAreas: Map<string, string>;
}

export const LEVEL_DATA: LevelData[] = [
    {
        startingInventory: "tutorial",
        validWords: new Set<string>(["tut", "trial", "trail"]),
        textAreas: new Map<string, string>([
            ["7,2", "Step on text to read\nclues and hints to heed"],
            ["4,3", "Welcome weary traveler to this magical quest of spelling and spell.\nMany monsters you'll meet\nand puzzles to defeat.\nHow many will you fell?"],      
            ["6,5", "Congrats, you went down, up, left and right.\nNow walk into the monster with all your of might"], 
            ["4,5", "You can only use the letters in your inventory\nTo figure out the puzzles contained in this story!"],
            ["9,5", "Go right once more,\nyou can slip on the icy floor!"],
            ["15,5", "Walk into the Pharaoh fast\nanswer his clue to get past."],
            ["17,6", "Why do mummies make bad gifts?\nBecause they are hard to unwrap."],
            ["17,11", "One more test\n do your best.\nWalk into the alter\nand begin your quest."]
        ]) 
    },
    {
        startingInventory: "none",
        validWords: new Set<string>(["neon", "one"]),
        textAreas: new Map<string, string>([
            ["4,4", "Into the guard you must move\na riddle you will recieve\nif they, your answer, approve\nyou may just get them to leave."]
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
          ["8,24", "Each of these paths go to the same room,\nthree books on one path you must exhume\nif you dont get them right\nby morning's first light\nyou'll never escape this terrible tomb!"]
        ])
    },
    {
        startingInventory: "vacant",
        validWords: new Set<string>(['vat','adjacent', 'savant', 'sonata']), //TODO
        textAreas: new Map<string, string>([ 
        ])
    },
];