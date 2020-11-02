import { Direction, Play } from "./play";
import type { Word } from "./word";

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
        return new Board(pojo.tiles);
    }

    toPojo() {
        return {
            tiles: this.tiles
        };
    }

    isValidPlay(play: Play): boolean {
        if (play.direction === Direction.Horizontal) {
            return play.x + play.letters.length <= 15;
        } else {
            return play.y + play.letters.length <= 15;
        }
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

    wordsFromPlay(play: Play): Word[] {
        return [];
    }

    static isTripleWord(x: number, y: number): boolean {
        return (x == 0 || x == 7 || x == 14) && (y == 0 || y == 7 || y == 14) && !(x == 7 && y == 7);
    }

    static isDoubleWord(x: number, y: number): boolean {
        return (x == y || x == 14 - y) && (x <= 4 || x >= 10 || x == 7);
    }

    static isDoubleLetter(x: number, y: number): boolean {
        const isDoubleLetterInner = (x: number, y: number) => (x == 0 && y == 3) || (x == 6 && y == 2) || (x == 3 && y == 0) || (x == 2 && y == 6) || (x == 6 && y == 6);

        return isDoubleLetterInner(x, y) || isDoubleLetterInner(14 - x, y) || isDoubleLetterInner(x, 14 - y) || isDoubleLetterInner(14 - x, 14 - y);
    }

    static isTripleLetter(x: number, y: number): boolean {
        return !Board.isDoubleWord(x, y) && (x == 1 || x == 5 || x == 9 || x == 13) && (y == 1 || y == 5 || y == 9 || y == 13);
    }
}