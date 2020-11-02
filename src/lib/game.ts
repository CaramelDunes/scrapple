import { Bag } from "./bag";
import { Board } from "./board";
import type { Language } from "./dictionary";
import type { Play } from "./play";
import type { Word } from "./word";

export class Game {
    language: Language;
    board: Board;
    playerTurn: number;
    scores: number[];
    bag: Bag;
    trays: string[][];
    plays: Word[];

    constructor(language: Language, board: Board, playerTurn: number, scores: number[], bag: Bag, trays: string[][], plays: Word[]) {
        this.language = language;
        this.board = board;
        this.playerTurn = playerTurn;
        this.scores = scores;
        this.bag = bag;
        this.trays = trays;
        this.plays = plays;
    }

    static new(language: Language): Game {
        const bag = Bag.full(language);
        return new Game(language, Board.empty(), Math.round(Math.random()), [0, 0], bag, [bag.draw(7), bag.draw(7)], []);
    }

    static fromPojo(pojo): Game {
        return new Game(pojo.language, Board.fromPojo(pojo.board), pojo.playerTurn, pojo.scores, Bag.fromPojo(pojo.bag), pojo.trays, pojo.plays);
    }

    toPojo() {
        return {
            language: this.language,
            board: this.board.toPojo(),
            playerTurn: this.playerTurn,
            scores: this.scores,
            bag: this.bag.toPojo(),
            trays: this.trays,
            plays: this.plays
        };
    }

    private isValidPlayerId(playerId: number): boolean {
        return playerId === 0 || playerId === 1;
    }

    isValidPlay(playerId: number, play: Play): boolean {
        return this.isValidPlayerId(playerId) && this.board.isValidPlay(play);
    }

    play(play: Play) {
        this.board.place(play);
        this.plays.push(play);
    }

    static randomId() {
        // Generates a random 6 uppercase letters code.
        // 308 915 776 = 26^6
        return Math.floor(Math.random() * 308915776).toString(26).toUpperCase().padStart(6, 'Z')
            .replace('0', 'Z')
            .replace('1', 'Y')
            .replace('2', 'X')
            .replace('3', 'W')
            .replace('4', 'V')
            .replace('5', 'U')
            .replace('6', 'T')
            .replace('7', 'S')
            .replace('8', 'R')
            .replace('9', 'Q');
    }
}