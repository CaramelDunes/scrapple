import { Play } from "./play";

export class Racks {
    0: string[];
    1: string[];

    constructor(a: string[], b: string[]) {
        this[0] = a;
        this[1] = b;
    }

    static empty() {
        return new Racks([], []);
    }

    static fromPojo(pojo) {
        return new Racks(pojo[0] ?? [], pojo[1] ?? []);
    }

    toPojo() {
        return this;
    }

    lengths() {
        return [this[0].length, this[1].length];
    }

    contains(playerId: number, tiles: string[]) {
        if (tiles.length > this[playerId].length) return false;

        const copy = [...this[playerId]];
        return Racks.removeAllFromTray(copy, tiles);
    }

    static removeAllFromTray(tray: string[], letters): boolean {
        for (const element of letters) {
            if (!Racks.removeFromList(tray, Play.isBlankTile(element) ? ' ' : element)) return false;
        }

        return true;
    }

    static removeFromList(list, element): boolean {
        const index = list.indexOf(element);
        if (index > -1) {
            list.splice(index, 1);
            return true;
        }

        return false;
    }
}