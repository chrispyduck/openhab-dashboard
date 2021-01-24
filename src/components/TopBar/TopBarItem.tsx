import React from "react";
import ItemCommandDisplay from "./widgets/ItemCommandWidget";
import { ITopBarWidget } from "./widgets/ITopBarWidget";

type ItemMappings = { [key: string]: React.ElementType };
const DashboardItemMappings: ItemMappings = {
  "command": ItemCommandDisplay,
};

const TopBarItem: React.FC<{
  config: ITopBarWidget
}> = ({ config }) => {
  if (!config || !config.show)
    return null;

  const View = DashboardItemMappings[config.type];
  if (!View) {
    console.warn(`Unsupported top bar widget type "${config.type}"`);
    return null;
  }
  return <View config={config} />;
}

export default TopBarItem;