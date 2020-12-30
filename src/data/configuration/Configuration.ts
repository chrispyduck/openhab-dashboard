import { ITopBarConfiguration } from "./TopBar";
import { IOpenHABConfiguration } from "./OpenHABConfiguration";
import { IViewCollection } from "./Views";
import { IScreensaverConfiguration } from "./Screensaver";

/**
 * The expected format of the public/config.json file
 */
export default interface IConfiguration {
  /**
   * The persistent top bar of thee UI
   */
  topbar: ITopBarConfiguration;

  /**
   * Specifies how the UI will communicate with OpenHAB
   */
  openhab: IOpenHABConfiguration;

  /**
   * All supported views
   */
  views: IViewCollection;

  /**
   * The key of the view that will be used as the default when the UI first opens
   */
  defaultView: keyof IViewCollection | undefined;

  /**
   * Screensaver configuration
   */
  screensaver: IScreensaverConfiguration;
}

