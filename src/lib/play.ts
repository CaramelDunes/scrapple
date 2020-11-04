export enum Direction {
    Horizontal,
    Vertical
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
        if (Play.isValidPosition(pojo.x, pojo.y)
            && pojo.letters.length <= 7
            && ((pojo.direction === Direction.Horizontal && pojo.x + pojo.letters.length <= 15)
                || (pojo.direction === Direction.Vertical && pojo.y + pojo.letters.length <= 15))
            && pojo.letters.every(Play.isValidLetter)) {
            return new Play(pojo.x, pojo.y, pojo.direction, pojo.letters);
        }
    }

    toPojo() {
        return this;
    }

    static isValidPosition(x: number, y: number): boolean {
        return x >= 0 && x < 15 && y >= 0 && y < 15;
    }

    static isValidLetter(letter: string) {
        return letter.length === 1 && ((letter >= 'A' && letter <= 'Z') || (letter >= 'a' && letter <= 'z'));
    }

    static isBlankTile(letter: string) {
        return letter.length === 1 && letter >= 'a' && letter <= 'z';
    }
}