import React, { useContext, Children } from "react";
import { observer } from "mobx-react";
import { makeStyles } from "@material-ui/core/styles";
import DataContext from "components/DataContext";
import { Item } from "data/Item";
import { ItemCommandWidgetObserved, IItemCommandConfig } from "../ItemCommand";
import { ITopBarWidget } from "../ITopBarWidget";

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
    marginLeft: theme.spacing(2),
    marginRight: theme.spacing(2),
    textTransform: "none"
  },
  icon: {
    textAlign: "right",
    margin: theme.spacing(1)
  },
  text: {
    textAlign: "left",
    margin: theme.spacing(1)
  },
  button: {
    padding: 0,
  }
}));

export const MiniMediaView: React.FC<{
  config: IItemCommandConfig,
  item: Item,
  icon?: string,
}> = (props) => {
  return (
    <ItemCommandWidgetObserved config={props.config} item={props.item} icon={props.icon}>
      hiya!
    </ItemCommandWidgetObserved>
  );
};

const MiniMediaObserved = observer(MiniMediaView);

/**
 * Displays the current status as text. When the text is clicked, a menu is rendered allowing the user to
 * select a different status. If children are provided, they are rendered to the left.
 */
export const MiniMediaWidget: React.FC<{
  config: ITopBarWidget,
  icon?: string
}> = (props) => {
  const data = useContext(DataContext);
  const commandConfig = props.config as IItemCommandConfig;
  const item = data.getItem(commandConfig.itemName);

  if (!item)
    return null;

  return <MiniMediaObserved config={commandConfig} item={item as Item} icon={props.icon} />;
};
