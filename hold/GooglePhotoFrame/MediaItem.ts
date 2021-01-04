import { IMediaItem } from "./index";

export class MediaItem {
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
