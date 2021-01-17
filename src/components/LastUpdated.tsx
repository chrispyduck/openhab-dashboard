import React, { useState, useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { observer } from "mobx-react";
import { Item } from "../data/Item";
import { durationFormatter } from "human-readable";

const useStyles = makeStyles(() => ({
  lastUpdated: {
    position: "absolute",
    right: 0,
    bottom: 0,
    padding: 0,
    margin: 0,
    opacity: 0.3
  }
}));

const formatter = durationFormatter<string>({
  allowMultiples: ["m", "s"],
  keepNonLeadingZeroes: false,
});

const LastUpdatedView = ({ item }: { item: Item }) => {
  const classes = useStyles();
  const [lastUpdatedString, setLastUpdatedString] = useState("now");

  useEffect(() => {
    const timer = setTimeout(() => {
      const secondsSinceUpdate = new Date().getTime() - item.getLastUpdated().getTime()
      setLastUpdatedString(formatter(secondsSinceUpdate));
    }, 1000);
    return () => clearTimeout(timer);
  });

  return (
    <h6 className={classes.lastUpdated}>
      {lastUpdatedString}
    </h6>
  );
};

export default observer(LastUpdatedView);
