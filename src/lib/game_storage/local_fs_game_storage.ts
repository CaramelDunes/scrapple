import { promises as fs, mkdirSync } from "fs";
import { Game } from "../game";
import { GameStorage } from './game_storage';

export class LocalFsStorage extends GameStorage {
    path: string;

    constructor(path?: string) {
        super();

        this.path = path ?? 'games';
        mkdirSync(this.path, { recursive: true });
    }

    async get(gameId: string): Promise<Game> {
        try {
            const contents = await fs.readFile(`${this.path}/${gameId}.json`, 'utf8');
            return Game.fromPojo(JSON.parse(contents));
        }
        catch (e) {

        }

        return null;
    }

    async set(gameId: string, game: Game) {
        try {
            await fs.writeFile(`${this.path}/${gameId}.json`, JSON.stringify(game.toPojo()), 'utf8');
        }
        catch (e) {

        }
    }
}