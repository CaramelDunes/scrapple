import { createHash } from "crypto";

const PEPPER = 'pepper';

export function isValidPlayerKey(gameId: string, playerId: number, playerKey: string): boolean {
    return generatePlayerKey(gameId, playerId) === playerKey;
}

export function generatePlayerKey(gameId: string, playerId: number): string {
    return createHash('md5')
        .update(PEPPER)
        .update(gameId)
        .update(playerId.toString())
        .digest('hex');
}

export function generateCookie(gameId: string, playerId: number, path: string): string {
    return `${gameId}=${playerId}:${generatePlayerKey(gameId, playerId)}; SameSite=Lax; Max-Age=${3600 * 24 * 7}; Path=${path}`
}