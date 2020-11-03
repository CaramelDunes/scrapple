import { Language } from './language';

const initialContents = new Map<Language, Map<string, number>>();

{
    const fr = new Map<string, number>();
    const letters = ['*', 'E', 'A', 'I', 'N', 'O', 'R', 'S', 'T', 'U', 'L', 'D', 'M', 'G', 'B', 'C', 'P', 'F', 'H', 'V', 'J', 'Q', 'K', 'W', 'X', 'Y', 'Z'];
    const quantities = [2, 15, 9, 8, 6, 6, 6, 6, 6, 6, 5, 3, 3, 2, 2, 2, 2, 2, 2, 2, 1, 1, 1, 1, 1, 1, 1];

    for (let i = 0; i < letters.length; i++) {
        fr.set(letters[i], quantities[i]);
    }

    initialContents.set(Language.French, fr);
}

{
    const letters = ['*', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'];
    const quantities = [2, 9, 2, 2, 4, 12, 2, 3, 2, 9, 1, 1, 4, 2, 6, 8, 2, 1, 6, 4, 6, 4, 2, 2, 1, 2, 1];

    const en = new Map<string, number>();
    for (let i = 0; i < letters.length; i++) {
        en.set(letters[i], quantities[i]);
    }

    initialContents.set(Language.English, en);
}

export class Bag {
    contents: string[];

    constructor(contents: string[]) {
        this.contents = contents;
    }

    static full(language: Language): Bag {
        const contents = [];

        for (let [key, value] of initialContents.get(language).entries()) {
            for (let i = 0; i < value; i++) {
                contents.push(key);
            }
        }

        shuffle(contents);

        return new Bag(contents);
    }

    static fromPojo(pojo) {
        return new Bag(pojo.contents);
    }

    toPojo() {
        return { contents: this.contents };
    }

    draw(count: number): string[] {
        return this.contents.splice(0, Math.min(count, this.contents.length));
    }

    exchange(tiles: string[]): string[] {
        this.contents.push(...tiles);
        return this.draw(tiles.length);
    }
}

/**
 * https://stackoverflow.com/questions/6274339/how-can-i-shuffle-an-array
 * 
 * Shuffles array in place.
 * @param {Array} a items An array containing the items.
 */
function shuffle(a) {
    for (let i = a.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [a[i], a[j]] = [a[j], a[i]];
    }

    return a;
}