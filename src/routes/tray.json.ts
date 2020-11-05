import { isValidPlayerKey } from "../lib/authentication";
import { ErrorWithCode } from "../lib/error_with_code";
import type { Game } from "../lib/game";
import { TheGameStorage } from "../lib/game_storage/the_game_storage";

export async function get(req, res, next) {
    const gameId = req.query.id;
    const playerId = parseInt(req.body.playerId);
    const playerKey = req.body.key;

    // TODO: Check user can play.
    if (!isValidPlayerKey(gameId, playerId, playerKey)) {
        next(new ErrorWithCode('Unauthorized', 403));
        return;
    }
    const game: Game = await TheGameStorage.get(gameId);

    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify({ tray: game.racks[playerId] }));
}