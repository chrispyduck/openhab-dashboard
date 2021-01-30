import React, { useContext, Children } from "react";
import { observer } from "mobx-react";
import { makeStyles } from "@material-ui/core/styles";
import DataContext from "components/DataContext";
import { Item } from "data/Item";
import { IItemCommandConfig } from "./IItemCommandConfig";
import { Grid, Menu, MenuItem, Button, ListItemIcon, ListItemText } from "@material-ui/core";
import Icon from "components/Icon";
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
  },
  title: {
    position: "relative",
    top: theme.spacing(-1),
    marginTop: 0,
    marginBottom: theme.spacing(-0.5),
    lineHeight: 2,
    textAlign: "center",
    fontWeight: "normal",
    letterSpacing: "0.3px",
    backgroundColor: theme.palette.secondary.main,
    color: theme.palette.secondary.contrastText,
  }
}));

const ItemCommandWidgetView: React.FC<{
  config: IItemCommandConfig,
  item: Item,
  icon?: string,
}> = (props) => {
  const [anchorElement, setAnchorElement] = React.useState<null | HTMLElement>(null);
  const classes = useStyles();
  const supportedCommands = props.item.supportedCommands?.length
    ? props.item.supportedCommands
    : props.config.commands;
  const currentValue = props.item.getValue();
  let currentValueText = currentValue;
  if (supportedCommands) {
    const currentCmd = supportedCommands.find(c => c.command == currentValue);
    if (currentCmd && currentCmd.displayName)
      currentValueText = currentCmd.displayName;
  }
  const content = (
    <Grid container className={classes.root} alignItems="center">
      {!!props.icon && (
        <Grid item className={classes.icon} >
          <Icon icon={props.icon} />
        </Grid>
      )}
      <Grid item className={classes.text}>
        {currentValueText}
      </Grid>
    </Grid>
  );


  if (!supportedCommands?.length)
    // no supported commands; don't show a menu
    return content;

  const closeMenu = () => {
    setAnchorElement(null);
  };

  const childrenToRender = Children.toArray(props.children);
  const menuItems = supportedCommands.map(cmd => (
    <MenuItem key={cmd.command} onClick={() => {
      props.item.send(cmd.command);
      closeMenu();
    }}>
      <ListItemIcon>
        {cmd.command === currentValue
          ? <Icon icon="material:RadioButtonChecked" />
          : <Icon icon="material:RadioButtonUnchecked" />}
      </ListItemIcon>
      <ListItemText>
        {cmd.displayName}
      </ListItemText>
    </MenuItem>
  ));

  const menuChildren = childrenToRender.length > 0
    ? [
      <Grid container>
        <Grid item>
          {childrenToRender}
        </Grid>
        <Grid item>
          {menuItems}
        </Grid>
      </Grid>
    ] : (
      menuItems
    )

  if (props.config.title)
    menuChildren.unshift(
      <h4 className={classes.title}>
        {props.config.title}
      </h4>
    );

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
        {menuChildren}
      </Menu>
    </>
  );
};

export const ItemCommandWidgetObserved = observer(ItemCommandWidgetView);

/**
 * Displays the current status as text. When the text is clicked, a menu is rendered allowing the user to
 * select a different status. If children are provided, they are rendered to the left.
 */
export const ItemCommandWidget: React.FC<{
  config: ITopBarWidget,
  icon?: string
}> = (props) => {
  const data = useContext(DataContext);
  const commandConfig = props.config as IItemCommandConfig;
  const item = data.getItem(commandConfig.itemName);

  if (!item)
    return null;

  return <ItemCommandWidgetObserved config={commandConfig} item={item as Item} icon={props.icon} />;
};
