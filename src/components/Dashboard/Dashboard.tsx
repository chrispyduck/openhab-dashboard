import React from "react";
import { IDashboardWidget, DefaultConfiguration as DefaultWidgetConfiguration } from "./IDashboardWidget";
import { IViewConfiguration, IDashboardConfiguration } from "data/configuration/Views";
import { Item } from "data/Item";
import { Grid, Paper } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import DashboardWidget from "./DashboardWidget";
import { merge } from "lodash";

const useStyles = makeStyles((theme) => ({
  item: {
    position: "relative",
    margin: theme.spacing(1),
    height: "116px",
    display: "flex"
  },
  itemX2: {
    position: "relative",
    margin: theme.spacing(1),
    height: `${theme.spacing(1) + (116 * 2)}px`,
    display: "flex"
  },
  itemX3: {
    position: "relative",
    margin: theme.spacing(1),
    height: `${theme.spacing(1) + (116 * 3)}px`,
    display: "flex"
  }
}));

export interface IDashboardItemProps {
  config: IDashboardWidget,
  item: Item,
}


const Dashboard: React.FC<{ configuration: IViewConfiguration }> = ({ configuration }) => {
  const classes = useStyles();
  const config = configuration as IDashboardConfiguration;
  return (
    <Grid container>
      {config.items.map((rawItemConfig, index) => {
        const itemConfig = merge({}, DefaultWidgetConfiguration, rawItemConfig);
        return (
          <Grid item key={index} xs={itemConfig.cols || 12}>
            <Paper
              elevation={itemConfig.frame ? 2 : 0}
              className={itemConfig.rows == 3 ? classes.itemX3 : itemConfig.rows == 2 ? classes.itemX2 : classes.item}
            >
              <DashboardWidget config={itemConfig} />
            </Paper>
          </Grid>
        );
      })}
    </Grid>
  );
};

export default Dashboard;
