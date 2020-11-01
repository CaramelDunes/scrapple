import type { Game } from "../game";

export abstract class GameStorage {
    abstract async get(gameId: string): Promise<Game>;
    abstract async set(gameId: string, game: Game);
}