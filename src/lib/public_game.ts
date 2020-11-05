import { Board } from "./board";
import type { Language } from "./language";
import { HistoryItem } from "./history_item";

export class PublicGame {
    language: Language;
    board: Board;
    playerTurn: number;
    scores: number[];
    traySizes: number[];
    bagSize: number;
    history: HistoryItem[];
    ended: boolean;

    constructor(language: Language, board: Board, playerTurn: number, scores: number[], traySizes: number[], bagSize: number, history: HistoryItem[], ended: boolean) {
        this.language = language;
        this.board = board;
        this.playerTurn = playerTurn;
        this.scores = scores;
        this.traySizes = traySizes;
        this.bagSize = bagSize;
        this.history = history;
        this.ended = ended;
    }

    static fromPojo(pojo): PublicGame {
        return new PublicGame(pojo.language, Board.fromPojo(pojo.board), pojo.playerTurn, pojo.scores, pojo.traySizes, pojo.bagSize, pojo.history.map((item) => HistoryItem.fromPojo(item)), pojo.ended);
    }

    toPojo() {
        return {
            language: this.language,
            board: this.board.toPojo(),
            playerTurn: this.playerTurn,
            scores: this.scores,
            traySizes: this.traySizes,
            bagSize: this.bagSize,
            history: this.history.map((item) => item.toPojo()),
            ended: this.ended
        };
    }
}