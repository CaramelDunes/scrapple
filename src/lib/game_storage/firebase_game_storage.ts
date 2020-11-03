import * as admin from 'firebase-admin';
import { Game } from "../game";
import { GameStorage } from './game_storage';

admin.initializeApp({
    credential: admin.credential.applicationDefault(),
    databaseURL: 'https://letters-and-words.firebaseio.com'
});

const database = admin.database();

export class FirebaseGameStorage extends GameStorage {
    async get(gameId: string): Promise<Game> {
        const gameRef = database.ref(`game/${gameId}`);
        const snapshot = await gameRef.once('value');
        return Game.fromPojo(snapshot.val());
    }

    async set(gameId: string, game: Game) {
        const gameRef = database.ref(`game/${gameId}`);
        await gameRef.set(game.toPojo());
    }
}