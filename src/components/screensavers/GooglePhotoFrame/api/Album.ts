import { IAlbum } from "./model";

export class Album {
  constructor(source: IAlbum) {
    this.id = source.id;
    this.title = source.title;
  }

  public id: string;
  public title: string;
}