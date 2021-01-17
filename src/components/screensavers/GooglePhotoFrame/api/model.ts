export interface IPagedResults {
  nextPageToken: string;
}

export interface IQuery {
  pageSize?: number;
  pageToken?: string;
}

export interface IMediaItem {
  id: string,
  description: string,
  productUrl: string,
  baseUrl: string,
  mimeType: string,
  mediaMetadata: {
    creationTime: string,
    width: string,
    height: string,

    // Union field metadata can be only one of the following:
    photo: {
      cameraMake: string,
      cameraModel: string,
      focalLength: number,
      apertureFNumber: number,
      isoEquivalent: number,
      exposureTime: string
    },
    video: {
      cameraMake: string,
      cameraModel: string,
      fps: number,
      status: "UNSPECIFIED" | "PROCESSING" | "READY" | "FAILED"
    }
    // End of list of possible types for union field metadata.
  },
  contributorInfo: {
    profilePictureBaseUrl: string,
    displayName: string
  },
  filename: string
}

export interface IMediaItemQuery extends IQuery {
  albumId: string,
}

export interface IMediaItemsResults extends IPagedResults {
  mediaItems: Array<IMediaItem>;
}

export interface IAlbum {
  id: string,
  title: string,
  productUrl: string,
  isWriteable: boolean,
  shareInfo: {
    sharedAlbumOptions: {
      isCollaborative: boolean,
      isCommentable: boolean
    },
    shareableUrl: string,
    shareToken: string,
    isJoined: boolean,
    isOwned: boolean,
    isJoinable: boolean
  },
  mediaItemsCount: string,
  coverPhotoBaseUrl: string,
  coverPhotoMediaItemId: string
}

export interface IAlbumResults extends IPagedResults {
  albums: Array<IAlbum>;
}