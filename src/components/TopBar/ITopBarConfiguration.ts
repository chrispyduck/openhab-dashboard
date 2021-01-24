import { ITopBarWidget } from "./widgets/ITopBarWidget";
import { ITopBarTimeConfiguration } from "./ITopBarTimeConfiguration";

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
  items: { [key: string]: ITopBarWidget; };
}
