import { generateCookie, isValidPlayerKey } from "../lib/authentication";
import { isValidLanguage } from "../lib/language";
import { ErrorWithCode } from "../lib/error_with_code";
import { Game } from "../lib/game";
import { TheGameStorage } from "../lib/game_storage/the_game_storage";
import { Play } from "../lib/play";

import { pusher } from '../lib/server/pusher';

export async function get(req, res, next) {
    const gameId = req.query.id;

    if (!Game.isValidId(gameId)) {
        next(new ErrorWithCode('Invalid game id.', 400));
        return;
    }

    const playerId = parseInt(req.query.playerId ?? '');
    const playerKey = req.query.playerKey;

    const game: Game = await TheGameStorage.get(gameId);

    if (!game) {
        next(new ErrorWithCode('Game not found.', 404));
        return;
    }

    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify({ game: game.toPublicGame().toPojo(), tray: playerKey && isValidPlayerKey(gameId, playerId, playerKey) ? game.racks[playerId] : null }));
}

export async function post(req, res, next) {
    const language = req.body.language;

    if (!isValidLanguage(language)) {
        next(new ErrorWithCode('Invalid language.', 400));
        return;
    }

    const gameId = Game.randomId();

    const newGame = Game.new(language);
    await TheGameStorage.set(gameId, newGame);

    // Prevent the game creator from overwriting his player key if he clicks on the join link.
    res.setHeader('Set-Cookie',
        [generateCookie(gameId, 0, `/game/${gameId}`),
        generateCookie(gameId, 0, `/join`)]);

    res.setHeader('Location', `/game/${gameId}`);
    res.statusCode = 302;
    res.end();
}

export async function put(req, res, next) {
    const gameId = req.body.gameId;

    if (!Game.isValidId(gameId)) {
        next(new ErrorWithCode('Invalid game id.', 400));
        return;
    }

    const playerId = parseInt(req.body.playerId);
    const playerKey = req.body.playerKey;

    if (!isValidPlayerKey(gameId, playerId, playerKey)) {
        next(new ErrorWithCode('Unauthorized', 403));
        return;
    }

    const game: Game = await TheGameStorage.get(gameId);

    if (!game) {
        next(new ErrorWithCode('Game not found.', 404));
        return;
    }

    let success = false;

    if (req.body.pass === true) {
        if (game.isValidPass(playerId)) {
            game.pass();
            success = true;
        }
    } else if (req.body.exchange === true) {
        if (game.isValidExchange(playerId, req.body.exchangedTiles)) {
            game.exchange(req.body.exchangedTiles);
            success = true;
        }
    } else {
        const play = Play.fromPojo(req.body.play);

        if (!play) {
            next(new ErrorWithCode('Invalid play', 400));
            return;
        }

        if (game.isValidPlay(game.playerTurn, play)) {
            game.play(play);
            success = true;
        }
    }

    const publicGame = game.toPublicGame().toPojo();

    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify({
        success: success,
        game: publicGame,
        tray: game.racks[playerId]
    }));

    if (success) {
        pusher.trigger(gameId, 'board', {
            message: publicGame
        });

        await TheGameStorage.set(gameId, game);
    }
}