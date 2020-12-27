import React from "react";
import { IDashboardItem } from "../data/configuration/Items";
import { IViewConfiguration, IDashboardConfiguration } from "../data/configuration/Views";
import { Item } from "../data/Item";
import { Grid, Paper } from "@material-ui/core";
import Dimmer from "./widgets/Dimmer";
import { makeStyles } from "@material-ui/core/styles";
import OutdoorEnvironment from "./widgets/OutdoorEnvironment";
import IndoorEnvironment from "./widgets/IndoorEnvironment";

const useStyles = makeStyles((theme) => ({
  item: {
    margin: theme.spacing(1),
    height: "116px",
    display: "flex"
  },
}));

export interface IDashboardItemProps {
  config: IDashboardItem,
  item: Item,
}

const TypeToDashboardItem = (config: IDashboardItem): React.ReactNode => {
  let Component: React.ElementType;
  switch (config.type) {
    case "dimmer": {
      Component = Dimmer;
      break;
    }
    case "outdoor": {
      Component = OutdoorEnvironment;
      break;
    }
    case "indoor": {
      Component = IndoorEnvironment;
      break;
    }
    default: {
      console.warn(`Unspported dashboard item: ${config.type}`);
      return null;
    }
  }

  return <Component config={config} />;
};

const Dashboard: React.FC<{ configuration: IViewConfiguration }> = ({ configuration }) => {
  const classes = useStyles();
  const config = configuration as IDashboardConfiguration;
  return (
    <Grid container>
      {config.items.map((item, index) => {
        return (
          <Grid item key={index} xs={item.cols || 12}>
            <Paper elevation={2} className={classes.item}>
              {TypeToDashboardItem(item)}
            </Paper>
          </Grid>
        );
      })}
    </Grid>
  );
};

export default Dashboard;
