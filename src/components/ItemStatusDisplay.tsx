import React, { useContext } from "react";
import { observer } from "mobx-react-lite";
import DataContext from "./DataContext";
import { Item } from "../data/Item";
import { IItemTextDisplay } from "../data/IConfiguration";

/**
 * The current view name, displayed in the app bar
 */
function ItemStatusDisplayView<TValue>({ item }: { item: Item<TValue> }) {
  return (
    <span>
      {item.value}
    </span>
  );
}

const ItemStatusDisplayObserved = observer(ItemStatusDisplayView);

export default function ItemStatusDisplay<TValue>({ item: itemConfig }: { item: IItemTextDisplay | Item<TValue> }) {
  if (itemConfig instanceof Item)
    return <ItemStatusDisplayObserved item={itemConfig} />;
    
  const data = useContext(DataContext);
  const itemData = data.getItem(itemConfig);
  return <ItemStatusDisplayObserved item={itemData} />;
}
