import type { Direction } from "./play";

export class Word {
    x: number;
    y: number;
    direction: Direction;
    letters: string[];
    points: number;

    constructor(x: number, y: number, direction: Direction, letters: string[], points: number) {
        this.x = x;
        this.y = y;
        this.direction = direction;
        this.letters = letters;
        this.points = points;
    }

    static fromPojo(pojo): Word {
        return new Word(pojo.x, pojo.y, pojo.direction, pojo.letters, pojo.points);
    }

    toPojo() {
        return this;
    }
}