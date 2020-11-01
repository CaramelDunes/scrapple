import type { Board } from "./board";
import type { Play } from "./play";

export class Game {
    playerTurn: number;
    scores: number[];
    board: Board;
    trays: string[][];
    bag: string[];

    constructor(board: Board) {
        this.board = board;
    }

    static fromPojo(pojo): Game {
        return new Game(pojo.board);
    }

    toPojo() {
        return { board: this.board };
    }

    private isValidPlayerId(playerId: number): boolean {
        return playerId === 0 || playerId === 1;
    }

    isValidPlay(playerId: number, play: Play): boolean {
        return this.isValidPlayerId(playerId) && this.board.isValidPlay(play);
    }
}