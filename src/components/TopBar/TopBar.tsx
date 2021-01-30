import React, { useContext } from "react";
import { useHistory } from "react-router-dom";
import { makeStyles, useTheme } from "@material-ui/core/styles";
import { AppBar, Toolbar, IconButton, Typography, List, ListItem, ListItemText, Hidden, Drawer } from "@material-ui/core";
import MenuIcon from "@material-ui/icons/Menu";
import CloseIcon from "@material-ui/icons/Close";
import RefreshIcon from "@material-ui/icons/Refresh";
import DataContext from "components/DataContext";
import Clock from "./Clock";
import CurrentView from "./CurrentView";
import TopBarItem from "./TopBarItem";

const drawerWidth = 240;
const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
    marginBottom: theme.spacing(2),
  },
  appBar: {
    zIndex: theme.zIndex.drawer + 1,
  },
  drawerPaper: {
    width: drawerWidth
  },
  menuButton: {
    marginRight: theme.spacing(1),
  },
  refreshButton: {
    marginLeft: theme.spacing(0),
  },
  title: {
    marginRight: theme.spacing(2),
    display: "block"
  },
  grow: {
    flexGrow: 1,
  },
  clock: {
    marginRight: theme.spacing(2),
  },
  items: {
    marginRight: theme.spacing(1),
  },
  content: {
    flexGrow: 1,
    padding: theme.spacing(3),
  },
  closeMenuButton: {
    marginRight: "auto",
    marginLeft: 0,
  },
  toolbar: theme.mixins.toolbar,
}));

const TopBar: React.FC = () => {
  const classes = useStyles();
  const theme = useTheme();
  const data = useContext(DataContext);
  const history = useHistory();
  const [mobileOpen, setMobileOpen] = React.useState(false);

  const toggleDrawer = () => {
    setMobileOpen(!mobileOpen);
  };

  const drawer = (
    <div>
      <List>
        {Object.entries(data.configuration.views).map(([key, view]) => (
          <ListItem button key={key} selected={data.currentViewKey === key} onClick={() => {
            // this is rather ugly (updating the DataContext and the route)
            data.setCurrentView(key);
            toggleDrawer();
            history.push(`./${key}`);
          }}>
            <ListItemText primary={view.title} />
          </ListItem>
        ))}
      </List>
    </div>
  );

  const refresh = () => {
    window.location.reload();
  };

  return (
    <div className={classes.root}>
      <AppBar position="fixed" className={classes.appBar}>
        <Toolbar>
          <IconButton edge="start" className={classes.menuButton} color="inherit" aria-label="menu" onClick={toggleDrawer}>
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" className={classes.title}>
            <CurrentView />
          </Typography>
          <div className={classes.grow} />
          {data.configuration.topbar.time.show && (
            <>
              <Typography variant="h6" className={classes.clock}>
                <Clock format={data.configuration.topbar.time.format} />
              </Typography>
              <div className={classes.grow} />
            </>
          )}
          {Object.values(data.configuration.topbar.items).map((widgetConfig, index) => (
            <span className={classes.items} key={index}>
              <TopBarItem config={widgetConfig} />
            </span>
          ))}
          <IconButton edge="start" className={classes.refreshButton} color="inherit" aria-label="refresh" onClick={refresh}>
            <RefreshIcon />
          </IconButton>
        </Toolbar>
      </AppBar>
      {/* The implementation can be swapped with js to avoid SEO duplication of links. */}
      <Hidden smUp implementation="css">
        <Drawer
          variant="temporary"
          anchor={theme.direction === "rtl" ? "right" : "left"}
          open={mobileOpen}
          onClose={toggleDrawer}
          classes={{
            paper: classes.drawerPaper,
          }}
          ModalProps={{
            keepMounted: true, // Better open performance on mobile.
          }}
        >
          <IconButton onClick={toggleDrawer} className={classes.closeMenuButton}>
            <CloseIcon />
          </IconButton>
          {drawer}
        </Drawer>
      </Hidden>
      <div className={classes.toolbar} />
      {/*<div className={classes.content}>
        
        visible items list
        </div>*/}
    </div>
  );
}

export default TopBar;
