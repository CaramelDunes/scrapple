import { Language } from './language';
import { frenchDictionary } from './dictionaries/french';
import { englishDictionary } from './dictionaries/english';

export class Dictionary {
    tree;

    constructor(tree) {
        this.tree = tree;
    }

    has(word: string): boolean {
        let d = this.tree;

        for (let l of word) {
            if (!d.hasOwnProperty(l)) {
                return false;
            }

            d = d[l];
        }

        return d.hasOwnProperty('y');
    }
}

export const dictionaries = new Map<Language, Dictionary>([
    [Language.French, new Dictionary(JSON.parse(frenchDictionary))],
    [Language.English, new Dictionary(JSON.parse(englishDictionary))]
]);