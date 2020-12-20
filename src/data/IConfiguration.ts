export interface ITopBarTimeConfiguration {
  /**
   * If true, the current time will be displayed in the top bar
   */
  show: boolean;

  /**
   * See https://www.npmjs.com/package/dateformat for a list of supported format options
   */
  format: string;
}

export interface ITopBarConfiguration {
  time: ITopBarTimeConfiguration;
  items: { [key: string]: IItemTextDisplay };
}

export interface IItemTextDisplay {
  show: boolean;
  name: string;
}

export interface IViewConfiguration {
  title: string;

}

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

export interface IViewCollection {
  [key: string]: IViewConfiguration;
};

export default interface IConfiguration {
  topbar: ITopBarConfiguration;
  openhab: IOpenHABConfiguration;
  views: IViewCollection;
  defaultView: keyof IViewCollection | undefined;
}
