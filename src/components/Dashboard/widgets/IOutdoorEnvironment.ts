import { IDashboardWidget } from "../IDashboardWidget";
import { IDisplaySettings } from "data/configuration/Items";

/**
 * A small informational display of the current weather
 */

export interface IOutdoorEnvironment extends IDashboardWidget, IDisplaySettings {
  type: "outdoor";
  outdoorTemperatureItem?: string;
  outdoorHumidityItem?: string;
  outdoorConditionsItem?: string;
  outdoorConditionIconIdItem?: string;
}
