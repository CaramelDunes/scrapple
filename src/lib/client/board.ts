import type { Board } from "../board";
import { Direction, Play } from "../play";

export enum PlayError {
    None,
    Diagonal,
    Gap,
    Occupied,
    Empty
}

["Word have to be either horizontal ot vertical!", "Cannot have gaps!", "Cannot write over placed tiles!"]

export function playFromScratchBoard(board: Board, scratchBoard: Board): [Play, PlayError] {
    if (!scratchBoard) return null;

    let started = false;
    let startX;
    let startY;
    let direction = null;
    let letters = [];

    for (let x = 0; x < 15; x++) {
        for (let y = 0; y < 15; y++) {
            if (scratchBoard.tiles[x][y] !== "") {
                if (!started) {
                    letters.push(scratchBoard.tiles[x][y]);

                    started = true;
                    startX = x;
                    startY = y;
                } else if (direction == null) {
                    if (y == startY) {
                        direction = Direction.Horizontal;
                    } else if (x == startX) {
                        direction = Direction.Vertical;
                    } else {
                        return [null, PlayError.Diagonal];
                    }
                } else {
                    if (
                        (direction === Direction.Horizontal &&
                            y !== startY) ||
                        (direction === Direction.Vertical && x !== startX)
                    ) {
                        return [null, PlayError.Diagonal];
                    }
                }
            }
        }
    }

    if (started) {
        if (direction == null) {
            return [new Play(startX, startY, Direction.Horizontal, letters), PlayError.None];
        } else if (direction === Direction.Horizontal) {
            let ended = false;

            for (let x = startX + 1; x < 15; x++) {
                if (scratchBoard.tiles[x][startY] !== "") {
                    if (ended) {
                        return [null, PlayError.Gap];
                    }

                    if (board.tiles[x][startY] === "") {
                        letters.push(scratchBoard.tiles[x][startY]);
                    } else {
                        return [null, PlayError.Occupied];
                    }
                } else {
                    if (board.tiles[x][startY] === "") {
                        ended = true;
                    }
                }
            }

            return [new Play(startX, startY, direction, letters), PlayError.None];
        } else {
            let ended = false;

            for (let y = startY + 1; y < 15; y++) {
                if (scratchBoard.tiles[startX][y] !== "") {
                    if (ended) {
                        return [null, PlayError.Gap];
                    }

                    if (board.tiles[startX][y] === "") {
                        letters.push(scratchBoard.tiles[startX][y]);
                    } else {
                        return [null, PlayError.Occupied];
                    }
                } else {
                    if (board.tiles[startX][y] === "") {
                        ended = true;
                    }
                }
            }

            return [new Play(startX, startY, direction, letters), PlayError.None];
        }
    }

    return [null, PlayError.Empty];
}