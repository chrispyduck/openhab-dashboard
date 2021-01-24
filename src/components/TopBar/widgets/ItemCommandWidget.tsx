import React, { useContext, Children } from "react";
import { observer } from "mobx-react";
import { makeStyles } from "@material-ui/core/styles";
import DataContext from "components/DataContext";
import { Item } from "data/Item";
import { IItemCommandWidget } from "./IItemCommandWidget";
import { Grid, Menu, MenuItem, Button, ListItemIcon, ListItemText } from "@material-ui/core";
import Icon from "components/Icon";
import { ITopBarWidget } from "./ITopBarWidget";

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

const ItemCommandWidgetView: React.FC<{
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

  const childrenToRender = Children.toArray(props.children);
  const menuItems = props.item.supportedCommands.map(cmd => (
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
        <>
          {childrenToRender.length > 0
            ? (
              <>
                <Grid container>
                  <Grid item>
                    {childrenToRender}
                  </Grid>
                  <Grid item>
                    {menuItems}
                  </Grid>
                </Grid>
              </>
            ) : (
              menuItems
            )}
        </>
      </Menu>
    </>
  );
};

const ItemCommandWidgetObserved = observer(ItemCommandWidgetView);

/**
 * Displays the current status as text. When the text is clicked, a menu is rendered allowing the user to
 * select a different status. If children are provided, they are rendered to the left.
 */
const ItemCommandWidget: React.FC<{
  config: ITopBarWidget,
  icon?: string
}> = (props) => {
  const data = useContext(DataContext);
  const commandConfig = props.config as IItemCommandWidget;
  const item = data.getItem(commandConfig.itemName);

  if (!item)
    return null;

  return <ItemCommandWidgetObserved item={item as Item} icon={props.icon} />;
};

export default ItemCommandWidget;
