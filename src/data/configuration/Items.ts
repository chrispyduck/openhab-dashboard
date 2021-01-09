export interface IDisplaySettings {
  /** 
   * A boolean vaule indicating whether the item should be displayed. 
   * This value may be set to `false` to suppress the item in the UI without requiring the config file entry to be deleted.
   */
  show: boolean;
}

export interface IItemDisplaySettings extends IDisplaySettings {
  /**
   * The name of the OpenHAB item to be displayed
   */
  itemName: string;
}

export type DashboardItem = IDimmer | IOutdoorEnvironment | IIndoorEnvironment;

export interface IDashboardItem {
  /**
   * The type of dashboard item. Refer to {@link DashboardItem}.
   */
  type: string;

  /**
   * The number of columns that this dashboard item should span. As the dashboard is based on Material UI's grid, there are 12 columns available.
   */
  cols?: boolean | 1 | "auto" | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12 | undefined;

  rows?: 1 | 2 | undefined;
}

/**
 * A dimmable item with a value ranging from 0 to 100 and supporting ON and OFF commands.
 */
export interface IDimmer extends IDashboardItem, IItemDisplaySettings {
  title: string;
  icon: string;
  type: "dimmer";
}

/** 
 * A small informational display of the current weather 
 */
export interface IOutdoorEnvironment extends IDashboardItem, IDisplaySettings {
  type: "outdoor";
  outdoorTemperatureItem?: string;
  outdoorHumidityItem?: string;
  outdoorConditionsItem?: string;
  outdoorConditionIconIdItem?: string;
}

/**
 * A small informational display of the indoor environmental conditions
 */
export interface IIndoorEnvironment extends IDashboardItem, IDisplaySettings {
  type: "indoor";
  roomTemperatureItem: string;
  roomHumidityItem?: string;
}

