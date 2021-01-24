import { IScreensaverConfiguration } from "data/configuration/Screensaver";

export interface IGooglePhotoFrameConfiguration extends IScreensaverConfiguration {
  type: "google-photos";
  oAuthClientId: string;
  oAuthClientSecret: string;
  syncInterval: number;
  photoChangeInterval: number;
}

export const DefaultConfiguration: IGooglePhotoFrameConfiguration = {
  photoChangeInterval: 45,
  syncInterval: 86400,
  idleTime: 60,
  oAuthClientId: "",
  oAuthClientSecret: "",
  type: "google-photos",
};