import { IItemDisplaySettings } from "data/configuration/Items";
import { ITopBarWidget } from "../ITopBarWidget";

export interface IItemCommandConfig extends ITopBarWidget, IItemDisplaySettings {
  type: "command";

  /**
   * Commands that this item supports
   */
  commands: Array<{
    command: string,
    displayName: string
  }>;

  /**
   * A title to display at the top of the popup menu
   */
  title: string;
}
