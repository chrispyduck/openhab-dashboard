import React from "react";
import { IDashboardWidget } from "./IDashboardWidget";
import Dimmer from "./widgets/Dimmer";
import OutdoorEnvironment from "./widgets/OutdoorEnvironment";
import IndoorEnvironment from "./widgets/IndoorEnvironment";
import Media from "./widgets/Media";

type DashboardMappings = { [key: string]: React.ElementType };
const DashboardItemMappings: DashboardMappings = {
  "dimmer": Dimmer,
  "outdoor": OutdoorEnvironment,
  "indoor": IndoorEnvironment,
  "media": Media,
};

const DashboardWidget: React.FC<{ config: IDashboardWidget }> = ({ config }) => {
  const Component = DashboardItemMappings[config.type];
  if (!Component) {
    console.warn(`Unspported dashboard item: ${config.type}`);
    return null;
  }

  return <Component config={config} />;
};

export default DashboardWidget;
