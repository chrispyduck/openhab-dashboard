import React, { useEffect, useState } from "react";
import { google } from "googleapis";
import { Credentials } from "google-auth-library/build/src/auth/credentials";
import { OAuth2Client } from "google-auth-library/build/src/auth/oauth2client";
import { IGooglePhotoFrameConfiguration } from "../../data/configuration/Screensaver";
import Dexie from "dexie";
import { IScreensaverProps } from "./IScreensaverProps";
import KeyStore from "../../data/KeyStore";
import { createStyles, makeStyles, Theme } from "@material-ui/core";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    image: {
      backgroundSize: "contain",
      height: "100vh",
      width: "100vw"
    },
  }),
);

const db = new Dexie("screensaver.googlePhotos");
db.version(1).stores({
  mediaItems: "id,type,date,index",
  credentials: "id,key"
});
const mediaItemsTable = db.table<MediaItem>("mediaItems");
const credentialsTable = db.table<ICredential>("credentials");
const googleScopes = [
  "https://www.googleapis.com/auth/photoslibrary.readonly"
];
interface ICredential {
  id: string;
  key: Credentials;
}

class MediaItem {
  constructor(item: IMediaItem) {
    this.id = item.id;
    this.description = item.description;
    this.type = item.mediaMetadata.photo
      ? "photo"
      : item.mediaMetadata.video
        ? "video"
        : "unknown";
    this.url = item.baseUrl;
    this.date = new Date(item.mediaMetadata.creationTime);
    this.index = Math.floor(Math.random() * 100000);
  }

  public id: string;
  public description: string;
  public url: string;
  public type: "photo" | "video" | "unknown";
  public date: Date;
  public index: number;
}

interface IMediaItem {
  "id": string,
  "description": string,
  "productUrl": string,
  "baseUrl": string,
  "mimeType": string,
  "mediaMetadata": {
    "creationTime": string,
    "width": string,
    "height": string,

    // Union field metadata can be only one of the following:
    "photo": {
      "cameraMake": string,
      "cameraModel": string,
      "focalLength": number,
      "apertureFNumber": number,
      "isoEquivalent": number,
      "exposureTime": string
    },
    "video": {
      "cameraMake": string,
      "cameraModel": string,
      "fps": number,
      "status": "UNSPECIFIED" | "PROCESSING" | "READY" | "FAILED"
    }
    // End of list of possible types for union field metadata.
  },
  "contributorInfo": {
    "profilePictureBaseUrl": string,
    "displayName": string
  },
  "filename": string
}

interface IMediaItemsResults {
  nextPageToken: string;
  mediaItems: Array<IMediaItem>;
}

const needsSync = (): boolean => {
  const raw = window.localStorage.getItem("screensaver.googlePhotos:lastSync");
  const lastSync = (raw)
    ? Number.parseInt(raw)
    : 0;
  return (new Date().getTime() - lastSync > 6.048e8) // 1 week
}

const setLastSync = (): void => {
  window.localStorage.setItem("screensaver.googlePhotos:lastSync", new Date().getTime().toString())
}

const getSavedToken = async (config: IGooglePhotoFrameConfiguration): Promise<Credentials | undefined> => {
  const result = await credentialsTable.get("google:" + config.oAuthClientId);
  return result?.key;
}

const saveToken = async (config: IGooglePhotoFrameConfiguration, key: Credentials): Promise<void> => {
  await credentialsTable.put({
    id: "google:" + config.oAuthClientId,
    key
  });
}

const login = async (config: IGooglePhotoFrameConfiguration): Promise<OAuth2Client> => {
  const client = new OAuth2Client(config.oAuthClientId, config.oAuthClientSecret, window.location.toString());
  const savedToken = await getSavedToken(config);
  if (savedToken) {
    savedToken.expiry_date
    client.setCredentials(savedToken);
  }
  else {
    const url = client.generateAuthUrl({
      access_type: "offline",
      scope: googleScopes,
    });

    const validatedToken = await new Promise<Credentials>((resolve, reject) => {
      console.warn(`
**********************************************************************************************
This application needs to be authorized with Google. Please go to the following URL to login:
${url}

Once you have logged in, provide your code by running the following command in your browser
console: 

         window.__openhab_dashboard_google_oauth_verify("the code");
**********************************************************************************************`);
      const yuck = window as unknown as {
        __openhab_dashboard_google_oauth_verify: (code: string) => Promise<void>
      };
      yuck.__openhab_dashboard_google_oauth_verify = async function (code: string) {
        console.info("Fetching token ...");
        const token = await client.getToken(code);
        console.info("Token received; saving it ...", token);
        await saveToken(config, token.tokens);
        resolve(token.tokens);
      }
    });
  }
  client.forceRefreshOnFailure = true;
  return client;
}

const fetchAlbumItems = async (config: IGooglePhotoFrameConfiguration): Promise<void> => {
  const client = await login(config);

  if (!needsSync())
    return;

  console.log("Fetching Google Photos items...");
  let hasMore = true;
  const params = new URLSearchParams();
  const output: Array<MediaItem> = [];
  let count = 0;
  params.append("pageSize", "100");
  while (hasMore) {
    const response = await client.request<IMediaItemsResults>({
      method: "GET",
      url: `https://photoslibrary.googleapis.com/v1/mediaItems?${params.toString()}`
    });
    const results = response.data;
    if (results.nextPageToken)
      params.set("pageToken", results.nextPageToken);
    else
      hasMore = false;

    const items = results.mediaItems.map(item => new MediaItem(item));
    count += items.length;
    await mediaItemsTable.bulkPut(items);
    console.log(`Fetched ${count} items from Google Photos`);
  }
  console.log(`Fetched ${count} items from Google Photos`);
  setLastSync();
}

const fetchRandomMedia = async (): Promise<MediaItem | undefined> => {
  const count = await mediaItemsTable.count();
  const imageIndex = Math.floor(Math.random() * count);
  return await mediaItemsTable.offset(imageIndex).first();
}

const PhotoSwitchInterval = 10000;
const PhotoFrame: React.FC<IScreensaverProps> = (props) => {
  const config = props.config as IGooglePhotoFrameConfiguration;
  const [hasData, setHasData] = useState(false);
  const [currentMedia, setCurrentMedia] = useState<MediaItem | null>(null);
  const classes = useStyles();

  useEffect(() => {
    fetchAlbumItems(config).then(() => {
      setHasData(true);
    }, e => {
      console.error("Error when fetching data from Google Photos", e);
    })
  }, [props.config]);

  useEffect(() => {
    if (!props.show)
      return;
    let timer: NodeJS.Timeout | null = null;
    const changeImage = () => {
      fetchRandomMedia().then(result => {
        if (!result)
          setHasData(false);
        else {
          const img = new Image();
          let url = result.url;
          const urlParts = url.split("=");
          if (urlParts.length == 2) {
            url = urlParts[0];
          }
          img.src = `${url}=w${window.innerWidth}-h${window.innerHeight}`;
          img.onload = () => {
            setCurrentMedia(result);
          }
          img.onerror = (eventOrMessage, source, line, col, error) => {
            console.warn(`Error loading image ${result.id}: ${result.url}`, error);
          }
          timer = setTimeout(changeImage, PhotoSwitchInterval);
        }
      }, error => {
        console.warn("Error in fetchRandomMedia()", error);
        timer = setTimeout(changeImage, PhotoSwitchInterval);
      });
    };
    changeImage();
    return () => {
      if (timer)
        clearTimeout(timer);
    }
  }, [props.show])

  if (!hasData || !currentMedia) {
    return <span>Loading...</span>;
  }

  return <div className={classes.image} style={{backgroundImage: `url("${currentMedia.url}")`}}/>;
};

export default PhotoFrame;