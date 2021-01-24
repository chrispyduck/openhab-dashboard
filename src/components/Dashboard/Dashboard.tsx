import React from "react";
import { IDashboardWidget } from "./IDashboardWidget";
import { IViewConfiguration, IDashboardConfiguration } from "data/configuration/Views";
import { Item } from "data/Item";
import { Grid, Paper } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import DashboardWidget from "./DashboardWidget";

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
      {config.items.map((item, index) => {
        return (
          <Grid item key={index} xs={item.cols || 12}>
            <Paper elevation={2} className={item.rows == 3 ? classes.itemX3 : item.rows == 2 ? classes.itemX2 : classes.item}>
              <DashboardWidget config={item}/>
            </Paper>
          </Grid>
        );
      })}
    </Grid>
  );
};

export default Dashboard;
