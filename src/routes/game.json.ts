import { isValidPlayerKey } from "../lib/authentication";
import { Board, emptyBoard } from "../lib/board";
import { ErrorWithCode } from "../lib/error_with_code";
import { Game } from "../lib/game";
import { TheGameStorage } from "../lib/game_storage/the_game_storage";
import { Play } from "../lib/play";

export async function get(req, res) {
    const gameId = req.query.id;
    console.log(gameId);

    await TheGameStorage.set('AAAAAA', new Game(new Board(emptyBoard)));
    const g: Game = await TheGameStorage.get(gameId);

    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify(g));
}

export async function post(req, res) {
    const gameId = req.query.id;

    const newGame = req.body;

    await TheGameStorage.set(gameId, new Game(req.body));
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify(req.body));
}

export async function put(req, res, next) {
    const gameId = req.query.id;
    const gameNonce = req.query.key;

    const playerId = req.body.playerId;
    const playerKey = req.body.key;

    // TODO: Check user can play.
    if (!isValidPlayerKey(gameId, gameNonce, playerId, playerKey)) {
        next(new ErrorWithCode('Unauthorized', 403));
        return;
    }

    const g: Game = await TheGameStorage.get(gameId);

    const play = Play.fromPojo(req.body.play);
    const newGame = g.play(playerId, play);

    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify(req.body));
}