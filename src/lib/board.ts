import type { Language } from "./language";
import { Direction, Play } from "./play";
import { pointsForLetter } from "./points";
import { Word } from "./word";

export class Board {
    tiles: string[][];

    constructor(tiles: string[][]) {
        this.tiles = tiles;
    }

    static empty(): Board {
        const tiles = [];

        for (let i = 0; i < 15; i++) {
            tiles.push(['', '', '', '', '', '', '', '', '', '', '', '', '', '', '']);
        }

        return new Board(tiles);
    }

    static fromPojo(pojo) {
        return new Board(pojo.tiles ?? []);
    }

    toPojo() {
        return {
            tiles: this.tiles
        };
    }

    isEmpty(): boolean {
        for (let x = 0; x < 15; x++) {
            for (let y = 0; y < 15; y++) {
                if (this.tiles[x][y] !== '') {
                    return false;
                }
            }
        }

        return true;
    }

    isValidPlay(play: Play): boolean {
        let connected = false;
        let i = 0;

        if (play.direction === Direction.Horizontal) {
            for (let x = play.x; x < 15; x++) {
                if (this.tiles[x][play.y] === '') {
                    connected ||= x < 14 && this.tiles[x + 1][play.y] !== '';
                    connected ||= x > 0 && this.tiles[x - 1][play.y] !== '';
                    connected ||= play.y < 14 && this.tiles[x][play.y + 1] !== '';
                    connected ||= play.y > 0 && this.tiles[x][play.y - 1] !== '';

                    i++;
                    if (i === play.letters.length) break;
                }
            }
        } else if (play.direction === Direction.Vertical) {
            for (let y = play.y; y < 15; y++) {
                if (this.tiles[play.x][y] === '') {
                    connected ||= play.x < 14 && this.tiles[play.x + 1][y] !== '';
                    connected ||= play.x > 0 && this.tiles[play.x - 1][y] !== '';
                    connected ||= y < 14 && this.tiles[play.x][y + 1] !== '';
                    connected ||= y > 0 && this.tiles[play.x][y - 1] !== '';

                    i++;
                    if (i === play.letters.length) break;
                }
            }
        }

        const middle = connected
            || (play.direction === Direction.Horizontal && play.y === 7 && play.x <= 7 && play.x + play.letters.length > 7)
            || (play.direction === Direction.Vertical && play.x === 7 && play.y <= 7 && play.y + play.letters.length > 7);

        return middle && i === play.letters.length;
    }

    place(play: Play) {
        if (play.direction === Direction.Horizontal) {
            let i = 0;

            for (let x = play.x; x < 15; x++) {
                if (this.tiles[x][play.y] === '') {
                    this.tiles[x][play.y] = play.letters[i];
                    i++;

                    if (i >= play.letters.length) break;
                }
            }
        } else if (play.direction === Direction.Vertical) {
            let i = 0;

            for (let y = play.y; y < 15; y++) {
                if (this.tiles[play.x][y] === '') {
                    this.tiles[play.x][y] = play.letters[i];
                    i++;

                    if (i >= play.letters.length) break;
                }
            }
        } else {
            console.error("Unknown direction", play.direction);
        }
    }

    private findCrossWord(x: number, y: number,
        direction: Direction, letter: string, language: Language): Word {
        let start;
        let points = 0;
        let multiplier = 1;
        let word = [];

        if (direction === Direction.Horizontal) {
            start = x;

            while (start >= 1 && this.tiles[start - 1][y] !== '') {
                word.unshift(this.tiles[start - 1][y]);
                points += pointsForLetter(language, this.tiles[start - 1][y]);
                start--;
            }

            word.push(letter);
            points += pointsForLetter(language, letter) * Board.squareLetterMultiplier(x, y);
            multiplier *= Board.squareWordMultiplier(x, y);

            let end = x;

            while (end <= 13 && this.tiles[end + 1][y] !== '') {
                word.push(this.tiles[end + 1][y]);
                points += pointsForLetter(language, this.tiles[end + 1][y]);
                end++;
            }

            if (word.length > 1) {
                return new Word(start, y, direction, word, points * multiplier);
            }
        } else if (direction === Direction.Vertical) {
            start = y;

            while (start >= 1 && this.tiles[x][start - 1] !== '') {
                word.unshift(this.tiles[x][start - 1]);
                points += pointsForLetter(language, this.tiles[x][start - 1]);

                start--;
            }

            word.push(letter);
            points += pointsForLetter(language, letter) * Board.squareLetterMultiplier(x, y);
            multiplier *= Board.squareWordMultiplier(x, y);

            let end = y;

            while (end <= 13 && this.tiles[x][end + 1] !== '') {
                word.push(this.tiles[x][end + 1]);
                points += pointsForLetter(language, this.tiles[x][end + 1]);
                end++;
            }

            if (word.length > 1) {
                return new Word(x, start, direction, word, points * multiplier);
            }
        }

        return null;
    }

    wordsFromPlay(play: Play, language: Language): Word[] {
        const words = [];
        let i = 0;
        let points = 0;
        let multiplier = 1;

        if (play.direction === Direction.Horizontal) {
            let start = play.x;
            let word = [];

            while (start >= 1 && this.tiles[start - 1][play.y] !== '') {
                word.unshift(this.tiles[start - 1][play.y]);
                points += pointsForLetter(language, this.tiles[start - 1][play.y]);
                start--;
            }

            word.push(play.letters[i]);
            points += pointsForLetter(language, play.letters[i]) * Board.squareLetterMultiplier(play.x, play.y);
            multiplier *= Board.squareWordMultiplier(play.x, play.y);
            i++;

            let end = play.x;

            while (end <= 13) {
                if (this.tiles[end + 1][play.y] !== '') {
                    word.push(this.tiles[end + 1][play.y]);
                    points += pointsForLetter(language, this.tiles[end + 1][play.y]);
                } else {
                    if (i >= play.letters.length) break;

                    word.push(play.letters[i]);
                    points += pointsForLetter(language, play.letters[i]) * Board.squareLetterMultiplier(end + 1, play.y);
                    multiplier *= Board.squareWordMultiplier(end + 1, play.y);
                    i++;
                }

                end++;
            }

            if (word.length > 1) {
                words.push(new Word(start, play.y, play.direction, word, points * multiplier));
            }

            i = 0;
            for (let x = play.x; x < 15; x++) {
                if (this.tiles[x][play.y] === '') {
                    const word = this.findCrossWord(x, play.y, Direction.Vertical, play.letters[i], language);
                    if (word) words.push(word);

                    i++;

                    if (i >= play.letters.length) break;
                }
            }
        } else if (play.direction === Direction.Vertical) {
            let start = play.y;
            let word = [];

            while (start >= 1 && this.tiles[play.x][start - 1] !== '') {
                word.unshift(this.tiles[play.x][start - 1]);
                points += pointsForLetter(language, this.tiles[play.x][start - 1]);
                start--;
            }

            word.push(play.letters[i]);
            points += pointsForLetter(language, play.letters[i]) * Board.squareLetterMultiplier(play.x, play.y);
            multiplier *= Board.squareWordMultiplier(play.x, play.y);
            i++;

            let end = play.y;

            while (end <= 13) {
                if (this.tiles[play.x][end + 1] !== '') {
                    word.push(this.tiles[play.x][end + 1]);
                    points += pointsForLetter(language, this.tiles[play.x][end + 1]);
                } else {
                    if (i >= play.letters.length) break;

                    word.push(play.letters[i]);
                    points += pointsForLetter(language, play.letters[i]) * Board.squareLetterMultiplier(play.x, end + 1);
                    multiplier *= Board.squareWordMultiplier(play.x, end + 1);
                    i++;
                }

                end++;
            }

            if (word.length > 1) {
                words.push(new Word(play.x, start, play.direction, word, points * multiplier));
            }

            i = 0;
            for (let y = play.y; y < 15; y++) {
                if (this.tiles[play.x][y] === '') {
                    const word = this.findCrossWord(play.x, y, Direction.Horizontal, play.letters[i], language);
                    if (word) words.push(word);

                    i++;

                    if (i >= play.letters.length) break;
                }
            }
        }

        return words;
    }

    static isTripleWord(x: number, y: number): boolean {
        return (x == 0 || x == 7 || x == 14) && (y == 0 || y == 7 || y == 14) && !(x == 7 && y == 7);
    }

    static isDoubleWord(x: number, y: number): boolean {
        return (x == y || x == 14 - y) && (x <= 4 || x >= 10 || x == 7) && x !== 0 && y !== 0 && x !== 14 && y !== 14;
    }

    static isDoubleLetter(x: number, y: number): boolean {
        const isDoubleLetterInner = (x: number, y: number) => (x == 0 && y == 3) || (x == 6 && y == 2) || (x == 3 && y == 0) || (x == 2 && y == 6) || (x == 6 && y == 6);

        return isDoubleLetterInner(x, y) || isDoubleLetterInner(14 - x, y) || isDoubleLetterInner(x, 14 - y) || isDoubleLetterInner(14 - x, 14 - y);
    }

    static isTripleLetter(x: number, y: number): boolean {
        return !Board.isDoubleWord(x, y) && (x == 1 || x == 5 || x == 9 || x == 13) && (y == 1 || y == 5 || y == 9 || y == 13);
    }

    static squareLetterMultiplier(x: number, y: number): number {
        if (this.isDoubleLetter(x, y)) return 2;
        else if (this.isTripleLetter(x, y)) return 3;
        else return 1;
    }

    static squareWordMultiplier(x: number, y: number): number {
        if (this.isDoubleWord(x, y)) return 2;
        else if (this.isTripleWord(x, y)) return 3;
        else return 1;
    }
}