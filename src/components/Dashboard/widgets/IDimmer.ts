import { IDashboardWidget } from "../IDashboardWidget";
import { IItemDisplaySettings } from "../../../data/configuration/Items";

/**
 * A dimmable item with a value ranging from 0 to 100 and supporting ON and OFF commands.
 */

export interface IDimmer extends IDashboardWidget, IItemDisplaySettings {
  title: string;
  icon: string;
  type: "dimmer";
}
