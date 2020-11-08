import { FIREBASE_DATABASE_URL, GOOGLE_APPLICATION_CREDENTIALS } from "../server/config";
import { FirebaseGameStorage } from "./firebase_game_storage";
import { LocalFsStorage as LocalFsGameStorage } from "./local_fs_game_storage";

let gameStorage;

if (FIREBASE_DATABASE_URL && GOOGLE_APPLICATION_CREDENTIALS) {
    gameStorage = new FirebaseGameStorage();
} else {
    gameStorage = new LocalFsGameStorage();
}

export const TheGameStorage = gameStorage;

