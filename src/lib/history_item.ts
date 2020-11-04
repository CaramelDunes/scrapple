import { Word } from "./word";

export class HistoryItem {
    passed: boolean;
    exchangedTiles: number;
    words: Word[];

    constructor(passed: boolean, exchangedTiles: number, words: Word[]) {
        this.passed = passed;
        this.exchangedTiles = exchangedTiles;
        this.words = words;
    }

    static played(words: Word[]): HistoryItem {
        return new HistoryItem(false, 0, words);
    }

    static passed(): HistoryItem {
        return new HistoryItem(true, 0, []);
    }

    static exchanged(count: number): HistoryItem {
        return new HistoryItem(false, count, []);
    }

    static fromPojo(pojo): HistoryItem {
        return new HistoryItem(pojo.passed, pojo.exchangedTiles, pojo.words ? pojo.words.map((word) => Word.fromPojo(word)) : []);
    }

    toPojo() {
        return {
            passed: this.passed,
            exchangedTiles: this.exchangedTiles,
            words: this.words.map((word) => word.toPojo())
        }
    }
}