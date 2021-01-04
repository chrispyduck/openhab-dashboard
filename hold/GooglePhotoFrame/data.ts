import Dexie from "dexie";
import { MediaItem } from "./MediaItem";

const db = new Dexie("screensaver.googlePhotos");
db.version(1).stores({
  mediaItems: "id,type,date,index",
  credentials: "id,key"
});
const mediaItemsTable = db.table<MediaItem>("mediaItems");
//const credentialsTable = db.table<ICredential>("credentials");
