import { isValidPlayerKey } from "../lib/authentication";
import { Board } from "../lib/board";
import { Language } from "../lib/dictionary";
import { ErrorWithCode } from "../lib/error_with_code";
import { Game } from "../lib/game";
import { TheGameStorage } from "../lib/game_storage/the_game_storage";
import { Play } from "../lib/play";
import { PublicGame } from "../lib/public_game";

import { pusher } from '../lib/server/pusher';

export async function get(req, res) {
    const gameId = req.query.id;
    console.log(gameId);

    await TheGameStorage.set('AAAAAA', Game.new(Language.French));
    const game: Game = await TheGameStorage.get(gameId);

    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify({ game: PublicGame.fromGame(game).toPojo() }));
}

export async function post(req, res) {
    const gameId = Game.randomId();
    await TheGameStorage.set(gameId, Game.new(Language.French));

    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify(req.body));
}

export async function put(req, res, next) {
    const gameId = req.body.gameId;

    const playerId = req.body.playerId;
    const playerKey = req.body.key;

    // TODO: Check user can play.
    if (false && !isValidPlayerKey(gameId, playerId, playerKey)) {
        next(new ErrorWithCode('Unauthorized', 403));
        return;
    }

    const play = Play.fromPojo(req.body.play);
    const game: Game = await TheGameStorage.get(gameId);

    const newGame = game.play(play);
    const publicGame = PublicGame.fromGame(game).toPojo();

    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify({
        game: publicGame,
        tray: game.trays[playerId]
    }));

    pusher.trigger(gameId, 'board', {
        message: publicGame
    });

    await TheGameStorage.set('AAAAAA', game);
}