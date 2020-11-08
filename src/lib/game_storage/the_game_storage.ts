import { FIREBASE_DATABASE_URL } from "../server/config";
import { FirebaseGameStorage } from "./firebase_game_storage";
import { LocalFsStorage as LocalFsGameStorage } from "./local_fs_game_storage";

let gameStorage;

if (FIREBASE_DATABASE_URL) {
    gameStorage = new FirebaseGameStorage();
} else {
    gameStorage = new LocalFsGameStorage();
}

export const TheGameStorage = gameStorage;

