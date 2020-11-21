import type { Game } from "../game";

export abstract class GameStorage {
    abstract get(gameId: string): Promise<Game>;
    abstract set(gameId: string, game: Game);
}