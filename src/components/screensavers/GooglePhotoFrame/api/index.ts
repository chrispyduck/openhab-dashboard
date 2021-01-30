import { OAuth2Client } from "google-auth-library/build/src/auth/oauth2client";
import { IGooglePhotoFrameConfiguration } from "../configuration";
import { MediaItemsTable, AlbumsTable, CredentialsTable } from "./storage";
import { MediaItem } from "./MediaItem";
import { Album } from "./Album";
import { IQuery, IMediaItemQuery, IMediaItem, IMediaItemsResults, IPagedResults, IAlbumResults } from "./model"
import { GaxiosResponse } from "gaxios";
import { Credentials } from "google-auth-library/build/src/auth/credentials";

const LOCAL_STORAGE_PREFIX = "screensaver.googlePhotos";
const MEDIA_ITEM_COUNT_KEY = "mediaItemCount";
const ENDPOINT_ALBUMS_LIST = "https://photoslibrary.googleapis.com/v1/albums";
const ENDPOINT_MEDIAITEMS_SEARCH = "https://photoslibrary.googleapis.com/v1/mediaItems:search"
const SCOPES = [
  "https://www.googleapis.com/auth/photoslibrary.readonly"
];

export class GooglePhotos {

  constructor(config: IGooglePhotoFrameConfiguration) {
    this.config = config;
  }

  private config: IGooglePhotoFrameConfiguration;
  private client$: OAuth2Client | null = null;

  /**
   * Fetches the underlying OAuth2Client
   * @throws {Error} If the client is not initialized
   */
  public get client(): OAuth2Client {
    if (this.client$ === null)
      throw new Error("The client has not been initialized. Did you forget to call login()?");
    return this.client$;
  }

  private getSavedToken = async (): Promise<Credentials | undefined> => {
    const result = await CredentialsTable.get("google:" + this.config.oAuthClientId);
    return result?.key;
  }

  private saveToken = async (key: Credentials): Promise<void> => {
    await CredentialsTable.put({
      id: "google:" + this.config.oAuthClientId,
      key
    })
  }

  /**
   * Authenticates to the Google Photos API, configures the OAuth2 client, and synchronizes local data. 
   */
  public init = async (): Promise<void> => {
    const url = document.createElement("a");
    url.href = "/google-auth/";

    const client = new OAuth2Client(this.config.oAuthClientId, this.config.oAuthClientSecret, url.href);
    client.forceRefreshOnFailure = true;
    
    const queryParams = new URLSearchParams(window.location.search);
    if (queryParams && queryParams.has("code")) {
      const code = queryParams.get("code");
      if (code) {
        const token = await client.getToken(code)
        await this.saveToken(token.tokens);
      }
    }

    const savedToken = await this.getSavedToken();
    if (savedToken) {
      client.setCredentials(savedToken);
      this.client$ = client;
      await this.syncAlbums();
    } else {
      const url = client.generateAuthUrl({
        access_type: "offline",
        scope: SCOPES,
      });
      window.location.href = url;
    }
    
    
  }

  private needsSync(key: string): boolean {
    const now = new Date().getTime();
    const last = this.getLastSync(key);
    return this.config.syncInterval < now - last;
  }

  /**
   * Timestamp of the last sync, represented as the number of milliseconds since the epoch 
   */
  private getLastSync(key: string): number {
    const raw = this.get(`lastSync:${key}`);
    return (raw)
      ? Number.parseInt(raw)
      : 0;
  }

  /**
   * Set the last sync timestamp to the current date and time
   */
  private setLastSync = (key: string): void => {
    this.set(`lastSync:${key}`, new Date().getTime().toString());
  }


  private get = (key: string): string | null => {
    return window.localStorage.getItem(`${LOCAL_STORAGE_PREFIX}:${key}`);
  }
  private set = (key: string, value: string | null): void => {
    if (value === null)
      window.localStorage.removeItem(`${LOCAL_STORAGE_PREFIX}:${key}`);
    else
      window.localStorage.setItem(`${LOCAL_STORAGE_PREFIX}:${key}`, value);
  }

  /**
   * Fetch a list of albums, save the results, and fetch a list of photos belonging to those albums
   */
  public syncAlbums = async (): Promise<void> => {
    if (this.needsSync("albums")) {
      await this.fetchListPages<IAlbumResults>(
        ENDPOINT_ALBUMS_LIST,
        async r => {
          for (let i = 0; i < r.albums.length; i++) {
            const album = new Album(r.albums[i]);
            await AlbumsTable.put(album, album.id);
          }
        }
      );
      this.setLastSync("albums");
    }

    const albums = await AlbumsTable.toArray();
    for (let i = 0; i < albums.length; i++) {
      if (await this.syncAlbumItems(albums[i]))
        await this.countMediaItems();
    }
  }

  private countMediaItems = async (): Promise<void> => {
    const count = await MediaItemsTable.count();
    this.set(MEDIA_ITEM_COUNT_KEY, count.toString());
    console.info(`${count} media items available for use`);
  }

  private syncAlbumItems = async (album: Album): Promise<boolean> => {
    const KEY = `itemsForAlbum:${album.id}`;
    if (!this.needsSync(KEY))
      return false;

    const request: IMediaItemQuery = {
      albumId: album.id
    };
    await this.fetchQueryResults<IMediaItemQuery, IMediaItemsResults>(
      KEY,
      ENDPOINT_MEDIAITEMS_SEARCH,
      request,
      async r => {
        for (let i = 0; i < r.mediaItems.length; i++)
          await this.processMediaItem(album, r.mediaItems[i]);
      }
    );
    this.setLastSync(KEY);
    return true;
  }

  /**
   * Upsert the specified media item; if the item already exists, update its fields and append to its list of albums
   */
  private processMediaItem = async (album: Album, rawItem: IMediaItem): Promise<void> => {
    let item = await MediaItemsTable.get(rawItem.id);
    if (!item) {
      item = new MediaItem(rawItem);
      item.albums.push(album);
    } else {
      if (!item.albums.find(a => a.id == album.id))
        item.albums.push(album);
      MediaItem.merge(item, rawItem);
    }
    await MediaItemsTable.put(item, item.id);
  }

  /**
   * Executes a GET request against the specified URL and repeats the request until no further pages are available
   * @param url
   */
  private fetchListPages = async <TPageResponse extends IPagedResults>(
    url: string,
    handler: (page: TPageResponse) => Promise<void>,
  ): Promise<void> => {
    let hasMore = true;
    const params = new URLSearchParams();
    params.append("pageSize", "50");
    while (hasMore) {
      const response = await this.client.request<TPageResponse>({
        method: "GET",
        url: `${url}?${params.toString()}`,
      });
      const results = response.data;
      if (results.nextPageToken)
        params.set("pageToken", results.nextPageToken);
      else
        hasMore = false;

      await handler(results);
    }
  }

  private fetchQueryResults = async <TRequest extends IQuery, TPageResponse extends IPagedResults>(
    key: string,
    url: string,
    request: TRequest,
    handler: (page: TPageResponse) => Promise<void>,
  ): Promise<void> => {
    const NEXT_PAGE_KEY = `query:${key}:nextPage`;
    let hasMore = true;
    request.pageSize = 50;
    const resumeToken = this.get(NEXT_PAGE_KEY);
    if (resumeToken !== null) {
      request.pageToken = resumeToken;
      console.info(`Resuming ${key} sync at page ${request.pageToken}`);
    }
    while (hasMore) {
      let response: GaxiosResponse<TPageResponse>;
      try {
        response = await this.client.request<TPageResponse>({
          method: "POST",
          url,
          data: request,
        });
      }
      catch (e) {
        if (e.message === "Invalid resume token.") {
          request.pageToken = undefined;
          this.set(NEXT_PAGE_KEY, null);
          continue;
        }
        throw e;
      }
      const results = response.data;
      this.set(NEXT_PAGE_KEY, results.nextPageToken);
      if (results.nextPageToken)
        request.pageToken = results.nextPageToken;
      else
        hasMore = false;

      await handler(results);
    }
  }

  public fetchRandomMedia = async (): Promise<MediaItem | undefined> => {
    const count = Number.parseInt(this.get(MEDIA_ITEM_COUNT_KEY) ?? "0");
    if (!count)
      return undefined;
    const imageIndex = Math.floor(Math.random() * count);
    return await MediaItemsTable.offset(imageIndex).first();
  }
}