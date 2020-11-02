import { Bag } from "./bag";
import { Board } from "./board";
import type { Language } from "./dictionary";
import type { Game } from "./game";
import type { Play } from "./play";
import type { Word } from "./word";

export class PublicGame {
    language: Language;
    board: Board;
    playerTurn: number;
    scores: number[];
    traySizes: number[];
    bagSize: number;
    plays: Word[];

    constructor(language: Language, board: Board, playerTurn: number, scores: number[], traySizes: number[], bagSize: number, plays: Word[]) {
        this.language = language;
        this.board = board;
        this.playerTurn = playerTurn;
        this.scores = scores;
        this.traySizes = traySizes;
        this.bagSize = bagSize;
        this.plays = plays;
    }

    static fromGame(game: Game): PublicGame {
        return new PublicGame(game.language, game.board, game.playerTurn, game.scores, game.trays.map(tray => tray.length), game.bag.contents.length, game.plays);
    }

    static fromPojo(pojo): PublicGame {
        return new PublicGame(pojo.language, Board.fromPojo(pojo.board), pojo.playerTurn, pojo.scores, pojo.traySizes, pojo.bagSize, pojo.plays);
    }

    toPojo() {
        return {
            language: this.language,
            board: this.board.toPojo(),
            playerTurn: this.playerTurn,
            scores: this.scores,
            traySizes: this.traySizes,
            bagSize: this.bagSize,
            plays: this.plays
        };
    }
}