import type { Direction } from "./play";

export class Word {
    x: number;
    y: number;
    direction: Direction;
    letters: string[];

    constructor(x: number, y: number, direction: Direction, letters: string[]) {
        this.x = x;
        this.y = y;
        this.direction = direction;
        this.letters = letters;
    }

    static fromPojo(pojo): Word {
        return new Word(pojo.x, pojo.y, pojo.direction, pojo.letters);
    }

    toPojo() {
        return this;
    }
}