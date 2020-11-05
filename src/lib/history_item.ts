import { Word } from "./word";

export class HistoryItem {
    passed: boolean;
    exchangedTiles: number;
    words: Word[];
    points: number;

    constructor(passed: boolean, exchangedTiles: number, words: Word[], points: number) {
        this.passed = passed;
        this.exchangedTiles = exchangedTiles;
        this.words = words;
        this.points = points;
    }

    static played(words: Word[], points: number): HistoryItem {
        return new HistoryItem(false, 0, words, points);
    }

    static passed(): HistoryItem {
        return new HistoryItem(true, 0, [], 0);
    }

    static exchanged(count: number): HistoryItem {
        return new HistoryItem(false, count, [], 0);
    }

    static fromPojo(pojo): HistoryItem {
        return new HistoryItem(pojo.passed, pojo.exchangedTiles, pojo.words ? pojo.words.map((word) => Word.fromPojo(word)) : [], pojo.points);
    }

    toPojo() {
        return {
            passed: this.passed,
            exchangedTiles: this.exchangedTiles,
            words: this.words.map((word) => word.toPojo()),
            points: this.points
        }
    }
}