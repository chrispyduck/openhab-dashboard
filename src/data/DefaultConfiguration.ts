import IConfiguration from "./configuration/Configuration";

export default {
  openhab: {
    hostname: "",
    port: 8080,
    ssl: false,
  },
  topbar: {
    time: {
      show: true,
      format: "shortTime",
    },
    items: {},
  },
  views: {},
  defaultView: undefined,
} as IConfiguration;
