import { IItemDisplaySettings } from "data/configuration/Items";
import { ITopBarWidget } from "./ITopBarWidget";

export interface IItemCommandWidget extends ITopBarWidget, IItemDisplaySettings {
  type: "command";
}
