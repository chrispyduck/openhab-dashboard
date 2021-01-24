import { IDimmer } from "../../components/Dashboard/widgets/IDimmer";
import { IIndoorEnvironment } from "../../components/Dashboard/widgets/IIndoorEnvironment";
import { IOutdoorEnvironment } from "../../components/Dashboard/widgets/IOutdoorEnvironment";

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


