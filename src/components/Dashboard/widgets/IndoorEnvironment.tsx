import React, { useContext } from "react";
import { Item, EmptyItem } from "data/Item";
import { makeStyles } from "@material-ui/core/styles";
import { Grid, Typography } from "@material-ui/core";
import Icon from "components/Icon";
import { IIndoorEnvironment } from "components/Dashboard/widgets/IIndoorEnvironment";
import DataContext from "components/DataContext";
import { observer } from "mobx-react";
import LastUpdated from "components/LastUpdated";

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
    <>
      <Grid container direction="row" justify="space-between" alignItems="center" className={classes.root}>
        <Grid item xs={5} className={classes.icon}>
          <Icon icon="fas:thermometer-half" />
        </Grid>
        <Grid item className={classes.values} xs={7}>
          <Typography variant="h5">{Math.round(Number.parseFloat(props.roomTemperature.getValue() || "0") * 10) / 10} °F</Typography>
          <Typography variant="subtitle1">{Math.round(Number.parseFloat(props.roomHumidity.getValue() || "0"))} %</Typography>
        </Grid>
      </Grid>
      <LastUpdated items={[props.roomTemperature, props.roomHumidity]} />
    </>
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
