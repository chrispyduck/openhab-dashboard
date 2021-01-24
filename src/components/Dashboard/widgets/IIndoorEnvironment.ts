import { IDashboardWidget } from "../IDashboardWidget";
import { IDisplaySettings } from "data/configuration/Items";

/**
 * A small informational display of the indoor environmental conditions
 */

export interface IIndoorEnvironment extends IDashboardWidget, IDisplaySettings {
  type: "indoor";
  roomTemperatureItem: string;
  roomHumidityItem?: string;
}
