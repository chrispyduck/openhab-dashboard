import React from "react";
import { ItemCommandWidget } from "./widgets/ItemCommand/ItemCommand";
import { ITopBarWidget } from "./widgets/ITopBarWidget";

type ItemMappings = { [key: string]: React.ElementType };
const DashboardItemMappings: ItemMappings = {
  "command": ItemCommandWidget,
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