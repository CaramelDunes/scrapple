import * as admin from 'firebase-admin';
import { Game } from "../game";
import { FIREBASE_DATABASE_URL } from '../server/config';
import { GameStorage } from './game_storage';

admin.initializeApp({
    credential: admin.credential.applicationDefault(),
    databaseURL: FIREBASE_DATABASE_URL
});

const database = admin.database();

export class FirebaseGameStorage extends GameStorage {
    async get(gameId: string): Promise<Game> {
        const gameRef = database.ref(`game/${gameId}`);
        const snapshot = await gameRef.once('value');

        const gamePojo = snapshot.val();
        if (!gamePojo) return null;

        return Game.fromPojo(gamePojo);
    }

    async set(gameId: string, game: Game) {
        const gameRef = database.ref(`game/${gameId}`);
        await gameRef.set(game.toPojo());
    }
}