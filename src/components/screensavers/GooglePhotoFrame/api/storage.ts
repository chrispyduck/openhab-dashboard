import Dexie from "dexie";
import { Credentials } from "google-auth-library/build/src/auth/credentials";
import { MediaItem } from "./MediaItem"
import { Album } from "./Album";

const db = new Dexie("screensaver.googlePhotos.api");
db.version(1).stores({
  mediaItems: "id,type,date,index",
  albums: "id",
  credentials: "id,key"
});

interface ICredential {
  id: string;
  key: Credentials;
}

export const CredentialsTable = db.table<ICredential>("credentials");
export const MediaItemsTable = db.table<MediaItem>("mediaItems");
export const AlbumsTable = db.table<Album>("albums");

export {
  db
};
