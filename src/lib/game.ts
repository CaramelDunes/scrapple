import { Bag } from "./bag";
import { Board } from "./board";
import { dictionaries, Dictionary } from "./dictionary";
import { HistoryItem } from "./history_item";
import type { Language } from "./language";
import type { Play } from "./play";
import { PublicGame } from "./public_game";
import type { Word } from "./word";

export class Game {
    language: Language;
    board: Board;
    playerTurn: number;
    scores: number[];
    bag: Bag;
    trays: string[][];
    history: HistoryItem[];

    constructor(language: Language, board: Board, playerTurn: number, scores: number[], bag: Bag, trays: string[][], history: HistoryItem[]) {
        this.language = language;
        this.board = board;
        this.playerTurn = playerTurn;
        this.scores = scores;
        this.bag = bag;
        this.trays = trays;
        this.history = history;
    }

    static new(language: Language): Game {
        const bag = Bag.full(language);
        return new Game(language, Board.empty(), Math.round(Math.random()), [0, 0], bag, [bag.draw(7), bag.draw(7)], []);
    }

    static fromPojo(pojo): Game {
        return new Game(pojo.language, Board.fromPojo(pojo.board), pojo.playerTurn, pojo.scores, Bag.fromPojo(pojo.bag), pojo.trays, (pojo.history ?? []).map((item) => HistoryItem.fromPojo(item)));
    }

    toPojo() {
        return {
            language: this.language,
            board: this.board.toPojo(),
            playerTurn: this.playerTurn,
            scores: this.scores,
            bag: this.bag.toPojo(),
            trays: this.trays,
            history: this.history.map((item) => item.toPojo())
        };
    }

    toPublicGame(): PublicGame {
        return new PublicGame(this.language, this.board, this.playerTurn, this.scores, this.trays.map(tray => tray.length), this.bag.contents.length, this.history);
    }

    isValidPlay(playerId: number, play: Play): boolean {
        if (this.playerTurn === playerId && this.trayContains(playerId, play.letters) && this.board.isValidPlay(play)) {
            const words = this.board.wordsFromPlay(play);

            for (const word in words) {
                if (!dictionaries.get(this.language).has(word)) return false;
            }

            return true;
        }

        return false;
    }

    isValidExchange(playerId: number, tiles: string[]): boolean {
        return this.playerTurn === playerId && this.trayContains(playerId, tiles) && this.bag.contents.length >= tiles.length;
    }

    play(play: Play) {
        const words = this.board.wordsFromPlay(play);
        let score = words.map((word) => word.points).reduce((a, b) => a + b, 0);

        if (play.letters.length === 7) {
            score += 50;
        }

        this.board.place(play);

        Game.removeAllFromList(this.trays[this.playerTurn], play.letters);
        this.trays[this.playerTurn].push(...this.bag.draw(7 - this.trays[this.playerTurn].length));

        this.playerTurn ^= 1;
        this.history.push(HistoryItem.played(words));
    }

    pass() {
        this.playerTurn ^= 1;
        this.history.push(HistoryItem.passed());
    }

    exchange(tiles: string[]) {
        Game.removeAllFromList(this.trays[this.playerTurn], tiles);
        this.trays[this.playerTurn].push(...this.bag.exchange(tiles));

        this.playerTurn ^= 1;
        this.history.push(HistoryItem.exchanged(tiles.length));
    }

    private trayContains(playerId: number, tiles: string[]) {
        if (tiles.length > this.trays[playerId].length) return false;

        const copy = [...this.trays[playerId]];
        return Game.removeAllFromList(copy, tiles);
    }

    private static removeFromList(list, element): boolean {
        const index = list.indexOf(element);
        if (index > -1) {
            list.splice(index, 1);
            return true;
        }

        return false;
    }

    private static removeAllFromList(list, elements): boolean {
        for (const element of elements) {
            if (!Game.removeFromList(list, element)) return false;
        }

        return true;
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