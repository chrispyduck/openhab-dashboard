import React, { useContext } from "react";
import { Item } from "data/Item";
import { makeStyles } from "@material-ui/core/styles";
import { Fab, Grid, Slider, Typography } from "@material-ui/core";
import Icon from "components/Icon";
import { IDimmer } from "components/Dashboard/widgets/IDimmer";
import DataContext from "components/DataContext";
import { observer } from "mobx-react";
import LastUpdated from "components/LastUpdated";

const useStyles = makeStyles((theme) => ({
  button: {
    height: "6em",
    width: "6em",
    margin: theme.spacing(2),
  },
  content: {
    flexGrow: 1,
    height: "6em",
  },
  sliderCell: {
    flexGrow: 1,
    maxWidth: "91%" //todo: "93%" is needed to make this look good on chrome
  },
  slider: {
    marginTop: theme.spacing(1),
    marginLeft: theme.spacing(2),
    marginRight: theme.spacing(2),
  },
  itemName: {
    marginTop: theme.spacing(1),
    marginBottom: theme.spacing(0),
    marginLeft: theme.spacing(2),
    textAlign: "left",
  }
}));

const convertStringPercentageToSliderValue = (input: string | undefined): number => {
  switch (input) {
    case undefined: return -10;
    case "ON": return 100;
    case "OFF": return -10;
    default: {
      let number = Number.parseInt(input);
      if (number <= 0)
        number = -10;
      if (number > 100)
        number = 100;
      return number;
    }
  }
};

const alignSliderValueToDimmerPercentage = (input: number): number => {
  // sanity chcek
  if (input > 100)
    return 100;
  // values > 3 are taken as-is
  if (input > 4)
    return input;
  // values between -3 and +4 are interpreted as 1
  if (input <= 4 && input >= -3)
    return 1;
  // everything else is 0
  return 0;
};

const DimmerView = ({ item, config }: { item: Item, config: IDimmer }) => {
  const classes = useStyles();
  const currentValue = convertStringPercentageToSliderValue(item.getValue());

  const handleChange = (_event: React.ChangeEvent<Record<string, never>>, value: number | number[]) => {
    const num = alignSliderValueToDimmerPercentage(value as number);
    item.setValue(num.toString());
  };
  const isOn = currentValue > 0;

  const togglePower = () => {
    if (isOn)
      item.setValue("OFF");
    else
      item.setValue("ON");
  };

  return (
    <>
      <Grid container direction="row" justify="space-between">
        <Grid item>
          <Fab color={isOn ? "primary" : "default"} aria-label="toggle" onClick={togglePower} className={classes.button}>
            <Icon icon={config.icon} />
          </Fab>
        </Grid>
        <Grid item container xs className={classes.content}>
          <Grid item container direction="column">
            <Grid item xs>
              <Typography gutterBottom variant="subtitle1" className={classes.itemName}>
                {config.title ? config.title : item.getDisplayName()}
              </Typography>
            </Grid>
            <Grid item xs className={classes.sliderCell}>
              <Slider value={currentValue}
                onChange={handleChange}
                aria-labelledby="continuous-slider"
                className={classes.slider}
                min={-10}
                max={100}
                step={1}
                marks={[
                  { value: -10, label: "Off" },
                  { value: 1, label: "Min" },
                  { value: 25, label: "25%" },
                  { value: 50, label: "50%" },
                  { value: 75, label: "75%" },
                  { value: 100, label: "100%" }
                ]} />
            </Grid>
          </Grid>
        </Grid>
      </Grid>
      <LastUpdated items={[item]}/>
    </>
  );
};

const DimmerObserved = observer(DimmerView);

const Dimmer: React.FC<{ config: IDimmer }> = ({ config }) => {
  const context = useContext(DataContext);
  const item = context.getItem(config.itemName);
  if (!item)
    return <span>Not found</span>;
  return <DimmerObserved item={item} config={config} />;
};

export default Dimmer;
