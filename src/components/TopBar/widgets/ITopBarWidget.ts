import { IDisplaySettings } from "data/configuration/Items";


export interface ITopBarWidget extends IDisplaySettings {
  /**
   * The type of widget to display on the top bar
   */
  type: string;
}