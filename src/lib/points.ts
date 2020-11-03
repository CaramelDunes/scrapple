import { Language } from "./language";

const pointsPerLetter = new Map<Language, Map<string, number>>();

const fr = new Map<string, number>();
const frPts = [0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2, 2, 2, 3, 3, 3, 4, 4, 4, 8, 8, 10, 10, 10, 10, 10]
const lettres = ["*", "E", "A", "I", "N", "O", "R", "S", "T", "U", "L", "D", "M", "G", "B", "C", "P", "F", "H", "V", "J", "Q", "K", "W", "X", "Y", "Z"]

for (let i = 0; i < frPts.length; i++) {
    fr.set(lettres[i], frPts[i]);
}

pointsPerLetter.set(Language.French, fr);

export function pointsForLetter(language: Language, letter: string): number {
    return pointsPerLetter.get(language).get(letter);
}