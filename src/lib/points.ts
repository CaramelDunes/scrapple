import { Language } from "./language";

const pointsPerLetter = new Map<Language, Map<string, number>>();

const fr = new Map<string, number>();
const frPts = [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2, 2, 2, 3, 3, 3, 4, 4, 4, 8, 8, 10, 10, 10, 10, 10]
const lettres = ["E", "A", "I", "N", "O", "R", "S", "T", "U", "L", "D", "M", "G", "B", "C", "P", "F", "H", "V", "J", "Q", "K", "W", "X", "Y", "Z"]

for (let i = 0; i < frPts.length; i++) {
    fr.set(lettres[i], frPts[i]);
}

pointsPerLetter.set(Language.French, fr);

const en = new Map<string, number>([
    ['E', 1], ['A', 1], ['I', 1], ['O', 1], ['N', 1], ['R', 1], ['T', 1], ['L', 1], ['S', 1], ['U', 1],
    ['D', 2], ['G', 2],
    ['B', 3], ['C', 3], ['M', 3], ['P', 3],
    ['F', 4], ['H', 4], ['V', 4], ['W', 4], ['Y', 4],
    ['K', 5],
    ['J', 8], ['X', 8],
    ['Q', 10], ['Z', 10]]);

pointsPerLetter.set(Language.English, en);


export function pointsForLetter(language: Language, letter: string): number {
    return pointsPerLetter.get(language).get(letter) ?? 0;
}