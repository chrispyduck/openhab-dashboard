import React, { useContext, useEffect } from "react";
import DataContext from "./DataContext";
import { Paper, Dialog, createStyles, makeStyles, Theme } from "@material-ui/core";
import { useIdle } from "react-use";
import { IScreensaverConfiguration } from "../data/configuration/Screensaver";
import GooglePhotoFrame from "./screensavers/GooglePhotoFrame";
import { IScreensaverProps } from "./screensavers/IScreensaverProps";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    container: {
      backgroundColor: "black",
      height: "100vh",
      width: "100vw"
    },
    screensaver: {
      height: "100vh",
      width: "100vw"
    },
  }),
);

const resolveScreensaver = (config: IScreensaverConfiguration): React.ElementType<IScreensaverProps> => {
  switch (config.type) {
    case "google-photos": return GooglePhotoFrame;
    default: return (props: IScreensaverProps) => {
      return <span>Not supported</span>;
    };
  }
}

const ScreenSaver: React.FC = () => {
  const classes = useStyles();
  const data = useContext(DataContext);
  const isIdle = useIdle(60e3);
  const Screensaver = resolveScreensaver(data.configuration.screensaver);

  return (
    <Dialog fullScreen 
      open={isIdle}
      disableBackdropClick={true}
      keepMounted={true}
    >
      <Paper className={classes.container}>
        <Screensaver show={isIdle} config={data.configuration.screensaver}/>
      </Paper>
    </Dialog>
  );
}

export default ScreenSaver;