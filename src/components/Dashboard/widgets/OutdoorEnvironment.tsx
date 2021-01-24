import React, { useContext } from "react";
import { Item, EmptyItem } from "data/Item";
import { makeStyles } from "@material-ui/core/styles";
import { Grid, Typography } from "@material-ui/core";
import { IOutdoorEnvironment } from "components/Dashboard/widgets/IOutdoorEnvironment";
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
    marginLeft: "-10px",
    alignItems: "center",
    justifyContent: "center",
  }
}));

const OutdoorEnvironmentView: React.FC<{
  outdoorTemperature: Item,
  outdoorHumidity: Item,
  outdoorConditions: Item,
  outdoorConditionIconId: Item,
  config: IOutdoorEnvironment,
}> = (props) => {
  const classes = useStyles();
  let temp = props.outdoorTemperature.getValue();
  const tempParts = temp?.split(" ");
  if (tempParts?.length == 2) {
    const val = Number.parseFloat(tempParts[0]);
    const units = tempParts[1];
    temp = `${Math.round(val * 10) / 10} ${units}`;
  }

  return (
    <>
      <Grid container direction="row" justify="space-between" alignItems="center" className={classes.root}>
        <Grid item xs={5} className={classes.icon}>
          <img src={`http://openweathermap.org/img/wn/${props.outdoorConditionIconId.getValue()}@2x.png`}
            alt={props.outdoorConditions.getValue()} />
        </Grid>
        <Grid item className={classes.values} xs={7}>
          <Typography variant="h5">{temp}</Typography>
          <Typography variant="subtitle1">{props.outdoorHumidity.getValue()}</Typography>
          <Typography variant="subtitle1">{props.outdoorConditions.getValue()}</Typography>
        </Grid>
      </Grid>
      <LastUpdated items={[props.outdoorHumidity, props.outdoorConditions]} />
    </>
  );
};

const OutdoorEnvironmentObserved = observer(OutdoorEnvironmentView);

const OutdoorEnvironment: React.FC<{ config: IOutdoorEnvironment }> = ({ config }) => {
  const context = useContext(DataContext);
  return <OutdoorEnvironmentObserved
    outdoorTemperature={context.getItem(config.outdoorTemperatureItem) || EmptyItem}
    outdoorHumidity={context.getItem(config.outdoorHumidityItem) || EmptyItem}
    outdoorConditions={context.getItem(config.outdoorConditionsItem) || EmptyItem}
    outdoorConditionIconId={context.getItem(config.outdoorConditionIconIdItem) || EmptyItem}
    config={config} />;
};

export default OutdoorEnvironment;
