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
}
