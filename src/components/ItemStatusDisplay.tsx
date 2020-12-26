import React, { useContext } from "react";
import { observer } from "mobx-react";
import { makeStyles } from "@material-ui/core/styles";
import DataContext from "./DataContext";
import { Item } from "../data/Item";
import { IItemDisplaySettings } from "../data/configuration/Items";
import { Grid, Menu, MenuItem, Button, ListItemIcon, ListItemText } from "@material-ui/core";
import Icon from "./Icon";

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

/**
 * The current view name, displayed in the app bar
 */
const ItemStatusDisplayView: React.FC<{
  item: Item,
  icon?: string,
}> = (props) => {
  const [anchorElement, setAnchorElement] = React.useState<null | HTMLElement>(null);
  const classes = useStyles();
  const currentValue = props.item.getValue();
  const content = (
    <Grid container className={classes.root} alignItems="center">
      {!!props.icon && (
        <Grid item className={classes.icon} >
          <Icon icon={props.icon} />
        </Grid>
      )}
      <Grid item className={classes.text}>
        {currentValue}
      </Grid>
    </Grid>
  );
  if (props.item.supportedCommands?.length == 0)
    // no supported commands; don't show a menu
    return content;

  const closeMenu = () => {
    setAnchorElement(null);
  };

  return (
    <>
      <Button aria-controls={`item-${props.item.name}-menu`} aria-haspopup="true" color="inherit"
        className={classes.button}
        onClick={(e) => setAnchorElement(e.currentTarget)}>
        {content}
      </Button>
      <Menu
        id={`item-${props.item.name}-menu`}
        anchorEl={anchorElement}
        keepMounted
        open={Boolean(anchorElement)}
        onClose={closeMenu}
      >
        {props.item.supportedCommands.map(cmd => (
          <MenuItem key={cmd.command} onClick={() => props.item.send(cmd.command)}>
            <ListItemIcon>
              {cmd.command === currentValue
                ? <Icon icon="material:RadioButtonChecked" />
                : <Icon icon="material:RadioButtonUnchecked" />}
            </ListItemIcon>
            <ListItemText>
              {cmd.displayName}
            </ListItemText>
          </MenuItem>
        ))}
      </Menu>
    </>
  );
};

const ItemStatusDisplayObserved = observer(ItemStatusDisplayView);

const ItemStatusDisplay: React.FC<{
  item: IItemDisplaySettings | Item | string,
  icon?: string
}> = (props) => {
  let item: typeof props.item | undefined = props.item;
  if (typeof item === "string") {
    const data = useContext(DataContext);
    item = data.getItem(item);
  } else if (item instanceof Item) {
    // nothing to do here
  } else if (typeof item === "object" && !!item.itemName) {
    const data = useContext(DataContext);
    item = data.getItem(item.itemName);
  }

  if (!item)
    return null;

  return <ItemStatusDisplayObserved item={item as Item} icon={props.icon} />;
};

export default ItemStatusDisplay;
