export enum Direction {
    Horizontal,
    Vetical
}

export class Play {
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

    static fromPojo(pojo): Play {
        return new Play(pojo.x, pojo.y, pojo.direction, pojo.letters);
    }

    toPojo() {
        return this;
    }
}