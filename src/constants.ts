export const READOUT_WIDTH_PX = 300;
export const INVENTORY_HEIGHT_PX = 240;
export const GAME_WORLD_TILE_WIDTH = 32;  //pixels
export const GAME_WORLD_TILE_HEIGHT = 32;  //pixels
export const MOVE_DELAY = 100; //ms
export const LETTER_HOLDER_SIZE = 45; // pixels
export const LETTER_HOLDER_TOP_MARGIN = -5;
export const LETTER_HOLDER_LEFT_MARGIN = -5;
export const LETTER_LEFT_MARGIN = 10;
export const LETTER_VERTICAL_MARGIN = 10;

export enum ItemResolutionResponse {
    NONE,
    DESTROY,
    PASS_THROUGH,
    CREATE_LETTER_L,
    PRINT_TEXT
}

export enum MoveDirection {
    UP,
    DOWN,
    LEFT,
    RIGHT,
}
