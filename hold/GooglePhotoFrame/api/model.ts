
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

export interface IMediaItemsResults {
  nextPageToken: string;
  mediaItems: Array<IMediaItem>;
}