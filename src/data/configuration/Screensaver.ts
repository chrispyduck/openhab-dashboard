export interface IScreensaverConfiguration {
  idleTime: number;
  type: string;
}

export interface IGooglePhotoFrameConfiguration extends IScreensaverConfiguration {
  type: "google-photos";
  oAuthClientId: string;
  oAuthClientSecret: string;
}