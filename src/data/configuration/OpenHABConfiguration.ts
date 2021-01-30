/**
 * Specifies how the application will communicate with OpenHAB
 */
export interface IOpenHABConfiguration {
  /**
   * Hostname or IP address of the OpenHAB server
   */
  hostname: string;

  /**
   * Port for the OpenHAB server (defaults to 8080)
   */
  port: number;

  /**
   * Set to true to use https; otherwise http will be used
   */
  ssl: boolean;

  /**
   * After this amount of time is elapsed without an item being updated, the item will be forcibly refreshed
   */
  forcedRefreshStaleInterval: number;

  /**
   * Maximum amount of time to wait between individual forced item refreshes within a single force refresh loop. The actual value will be randomly selected between 0 and this value. This function is used to stagger forced refreshes to keep load and traffic low.
   */
  forcedRefreshDelay: number;
}
