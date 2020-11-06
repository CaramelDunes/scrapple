import { generateCookie } from "../lib/authentication";
import { ErrorWithCode } from "../lib/error_with_code";
import { Game } from "../lib/game";

export async function get(req, res, next) {
    const gameId = req.query.id?.toUpperCase();

    if (!Game.isValidId(gameId)) {
        next(new ErrorWithCode('Invalid game id.', 400));
        return;
    }

    if (!(gameId in req.cookies)) {
        res.setHeader('Set-Cookie', generateCookie(gameId, 1, `/game/${gameId}`));
    }

    res.setHeader('Location', `/game/${gameId}`);
    res.statusCode = 302;
    res.end();
}