import { DashboardItem } from "./Items";

/**
 * Describes a configured view. Views are listed in the hamburger menu of the app bar.
 */
export interface IViewConfiguration {
  title: string;

  /**
   * A string value indicating the type of view. See {@type ViewType}
   */
  type: string;
}

/**
 * A collection of named views
 */
export interface IViewCollection {
  [key: string]: ViewType;
}

/**
 * Supported view types
 */
export type ViewType = IDashboardConfiguration;

/**
 * Describes a dashboard view
 */
export interface IDashboardConfiguration extends IViewConfiguration {
  type: "dashboard";
  items: Array<DashboardItem>;
}