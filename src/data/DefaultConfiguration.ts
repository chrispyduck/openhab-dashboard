import IConfiguration, { ITopBarConfiguration, ITopBarTimeConfiguration, IOpenHABConfiguration } from "./IConfiguration";

export default {
  openhab: {
    hostname: "",
    port: 8080,
    ssl: false,
  } as IOpenHABConfiguration,
  topbar: {
    time: {
      show: true,
      format: "shortTime",
    } as ITopBarTimeConfiguration,
    items: {},
  } as ITopBarConfiguration,
  views: {},
  defaultView: undefined,
} as IConfiguration;
