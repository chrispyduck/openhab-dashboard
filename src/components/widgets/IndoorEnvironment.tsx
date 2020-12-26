import React, { useContext } from "react";
import { Item, EmptyItem } from "../../data/Item";
import { makeStyles } from "@material-ui/core/styles";
import { Grid, Typography } from "@material-ui/core";
import Icon from "../Icon";
import { IIndoorEnvironment } from "../../data/IConfiguration";
import DataContext from "../DataContext";
import { observer } from "mobx-react";

const useStyles = makeStyles(() => ({
  root: {
    margin: "auto"
  },
  values: {
    alignItems: "center",
    textAlign: "left",
  },
  icon: {
    alignItems: "center",
    justifyContent: "center",
  }
}));

const IndoorEnvironmentView = (props: {
  roomTemperature: Item,
  roomHumidity: Item,
  config: IIndoorEnvironment,
}) => {
  const classes = useStyles();

  return (
    <Grid container direction="row" justify="space-between" alignItems="center" className={classes.root}>
      <Grid item xs={5} className={classes.icon}>
        <Icon icon="fas:thermometer-half" />
      </Grid>
      <Grid item className={classes.values} xs={7}>
        <Typography variant="subtitle1">{props.roomTemperature.getValue()}</Typography>
        <Typography variant="subtitle1">{props.roomHumidity.getValue()}</Typography>
      </Grid>
    </Grid>
  );
};

const IndoorEnvironmentObserved = observer(IndoorEnvironmentView);

const IndoorEnvironment: React.FC<{ config: IIndoorEnvironment }> = ({ config }) => {
  const context = useContext(DataContext);
  return <IndoorEnvironmentObserved
    roomTemperature={context.getItem(config.roomTemperatureItem) || EmptyItem}
    roomHumidity={context.getItem(config.roomHumidityItem) || EmptyItem}
    config={config} />;
};

export default IndoorEnvironment;
