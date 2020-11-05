import { Bag } from "./bag";
import { Board } from "./board";
import { dictionaries } from "./dictionary";
import { HistoryItem } from "./history_item";
import type { Language } from "./language";
import type { Play } from "./play";
import { pointsForLetter } from "./points";
import { PublicGame } from "./public_game";
import { Racks } from "./racks";

export class Game {
    language: Language;
    board: Board;
    playerTurn: number;
    scores: number[];
    bag: Bag;
    racks: Racks;
    history: HistoryItem[];
    opponentJoined: boolean;
    ended: boolean;

    constructor(language: Language, board: Board, playerTurn: number, scores: number[], bag: Bag, racks: Racks, history: HistoryItem[], opponentJoined: boolean, ended: boolean) {
        this.language = language;
        this.board = board;
        this.playerTurn = playerTurn;
        this.scores = scores;
        this.bag = bag;
        this.racks = racks;
        this.history = history;
        this.opponentJoined = opponentJoined;
        this.ended = ended;
    }

    static new(language: Language): Game {
        const bag = Bag.full(language);
        return new Game(language, Board.empty(), Math.round(Math.random()), [0, 0], bag, new Racks(bag.draw(7), bag.draw(7)), [], false, false);
    }

    static fromPojo(pojo): Game {
        return new Game(pojo.language,
            Board.fromPojo(pojo.board),
            pojo.playerTurn,
            pojo.scores,
            Bag.fromPojo(pojo.bag ?? {}),
            Racks.fromPojo(pojo.racks ?? {}),
            (pojo.history ?? []).map((item) => HistoryItem.fromPojo(item)),
            pojo.opponentJoined,
            pojo.ended);
    }

    toPojo() {
        return {
            language: this.language,
            board: this.board.toPojo(),
            playerTurn: this.playerTurn,
            scores: this.scores,
            bag: this.bag.toPojo(),
            racks: this.racks,
            history: this.history.map((item) => item.toPojo()),
            opponentJoined: this.opponentJoined,
            ended: this.ended
        };
    }

    toPublicGame(): PublicGame {
        return new PublicGame(this.language, this.board, this.playerTurn, this.scores, this.racks.lengths(), this.bag.contents.length, this.history, this.ended);
    }

    isValidPlay(playerId: number, play: Play): boolean {
        if (!this.ended && this.playerTurn === playerId && this.racks.contains(playerId, play.letters) && this.board.isValidPlay(play)) {
            const words = this.board.wordsFromPlay(play, this.language);
            return words.every((word) => dictionaries.get(this.language).has(word.letters.join('').toUpperCase()));
        }

        return false;
    }

    isValidExchange(playerId: number, tiles: string[]): boolean {
        return !this.ended && this.playerTurn === playerId && this.racks.contains(playerId, tiles) && this.bag.contents.length >= tiles.length;
    }

    isValidPass(playerId: number): boolean {
        return !this.ended && this.playerTurn === playerId;
    }

    play(play: Play) {
        const words = this.board.wordsFromPlay(play, this.language);
        let points = words.map((word) => word.points).reduce((a, b) => a + b, 0);

        if (play.letters.length === 7) {
            points += 50;
        }

        this.board.place(play);

        Racks.removeAllFromTray(this.racks[this.playerTurn], play.letters);
        this.racks[this.playerTurn].push(...this.bag.draw(7 - this.racks[this.playerTurn].length));

        if (this.racks[this.playerTurn].length === 0) {
            this.ended = true;
            points += this.substractRackPoints();
        }

        this.scores[this.playerTurn] += points;

        this.playerTurn ^= 1;
        this.history.unshift(HistoryItem.played(words, points));
    }

    pass() {
        this.playerTurn ^= 1;
        this.history.unshift(HistoryItem.passed());
    }

    exchange(tiles: string[]) {
        Racks.removeAllFromTray(this.racks[this.playerTurn], tiles);
        this.racks[this.playerTurn].push(...this.bag.exchange(tiles));

        this.playerTurn ^= 1;
        this.history.unshift(HistoryItem.exchanged(tiles.length));
    }

    private substractRackPoints(): number {
        let sum = 0;

        for (let i = 0; i < 2; i++) {
            for (const letter of this.racks[i]) {
                const letterPoints = pointsForLetter(this.language, letter);
                sum += letterPoints;
                this.scores[i] -= letterPoints;
            }

            this.racks[i] = [];
        }

        return sum;
    }

    static randomId() {
        // Generates a random 6 uppercase letters code.
        // 308 915 776 = 26^6
        return Math.floor(Math.random() * 308915776).toString(26).toUpperCase().padStart(6, 'Z')
            .replace(/0/g, 'Z')
            .replace(/1/g, 'Y')
            .replace(/2/g, 'X')
            .replace(/3/g, 'W')
            .replace(/4/g, 'V')
            .replace(/5/g, 'U')
            .replace(/6/g, 'T')
            .replace(/7/g, 'S')
            .replace(/8/g, 'R')
            .replace(/9/g, 'Q');
    }
}