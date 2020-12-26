import { IItemDisplaySettings } from "./Items";

export interface ITopBarConfiguration {
  /**
   * Configures the time display at the center of the app bar
   */
  time: ITopBarTimeConfiguration;

  /**
   * A list of item statuses to be inclulded in the app bar.
   * These items are aligned to the right of the bar.
   * Items that support a discrete list of commands will display those commands as a menu when clicked.
   */
  items: { [key: string]: IItemDisplaySettings; };
}

export interface ITopBarTimeConfiguration {
  /**
   * If true, the current time will be displayed in the top bar
   */
  show: boolean;

  /**
   * See https://www.npmjs.com/package/dateformat for a list of supported format options
   */
  format: string;
}