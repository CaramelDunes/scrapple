import { createHash } from "crypto";

const PEPPER = 'pepper';

export function isValidPlayerKey(gameId: string, playerId: number, playerKey: string) {
    return createHash('md5')
        .update(PEPPER)
        .update(gameId)
        .update(playerId.toString())
        .digest('hex') === playerKey;
}