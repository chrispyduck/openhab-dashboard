import React from "react";
import { makeStyles, Theme } from "@material-ui/core/styles";
import { ButtonGroup, Button, Grid } from "@material-ui/core";
import Icon from "components/Icon";
import { IMediaProps } from "./IMediaProps";
import { BaseCSSProperties } from "@material-ui/core/styles/withStyles";

interface LocalStyles {
  root: BaseCSSProperties,
  dPad: BaseCSSProperties,
  dPadUp: BaseCSSProperties,
  dPadLeft: BaseCSSProperties,
  dPadDown: BaseCSSProperties,
  dPadRight: BaseCSSProperties,
  dPadLabel: BaseCSSProperties,
  dPadCenter: BaseCSSProperties,
  miscButtons: BaseCSSProperties,
  miscButton: BaseCSSProperties,
}

// eslint-disable-next-line 
const useStyles = makeStyles<Theme, LocalStyles, any>((theme: Theme) => {
  const dPadButtonBase = {
    display: "block",
    position: "absolute",
    width: "50%",
    height: "50%",
    lineHeight: "40%",
    color: theme.palette.primary.contrastText,
    background: theme.palette.primary.main,
    textAlign: "center",
    borderWidth: "2px",
    borderColor: theme.palette.primary.contrastText,
    borderStyle: "solid",
    "&::hover": {
      background: theme.palette.primary.light,
      zIndex: 500,
    },
    "&::before": {
      content: "",
      position: "absolute",
      width: 0,
      height: 0,
      borderRadius: "5px",
      borderStyle: "solid",
      transition: "all .25s",
    },
    "&:after": {
      content: "",
      position: "absolute",
      width: "102%",
      height: "78%",
      background: theme.palette.primary.main,
      borderRadius: "20%",
    },
  }
  const dPadUp = {
    ...dPadButtonBase,
    top: "-11%",
    left: "50%",
    transform: "translate(-50%, 0) rotate(45deg)",
    borderRadius: "0 !important",
  };
  const dPadLeft = {
    ...dPadButtonBase,
    top: "50%",
    left: "-11%",
    transform: "translate(0, -50%) rotate(45deg)",
    borderRadius: "0 !important",
  };
  const dPadRight = {
    ...dPadButtonBase,
    top: "50%",
    right: "-11%",
    transform: "translate(0, -50%) rotate(45deg)",
    borderRadius: "0 !important",
  };
  const dPadDown = {
    ...dPadButtonBase,
    bottom: "-11%",
    left: "50%",
    transform: "translate(-50%, 0) rotate(45deg)",
    borderRadius: "0 !important",
  };
  const dPadCenter = {
    ...dPadButtonBase,
    width: "40%",
    height: "40%",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%) rotate(45deg)",
    borderRadius: "50% !important",
  }

  const styles = {
    root: {
      margin: "auto",
    },
    dPad: {
      position: "relative",
      margin: theme.spacing(1),
      borderRadius: "48%",
      overflow: "hidden",
      "&::before": {
        content: "",
        position: "absolute",
        top: "50%",
        left: "50%",
        borderRadius: "5%",
        transform: "translate(-50%, -50%)",
        width: "66.6%",
        height: "66.6%",
        background: theme.palette.primary.main,
      },
      "&::after": {
        content: "",
        position: "absolute",
        display: "none",
        zIndex: 2,
        width: "20%",
        height: "20%",
        top: "50%",
        left: "50%",
        background: theme.palette.primary.main,
        borderRadius: "50%",
        transform: "translate(-50%, -50%)",
        transition: "all .25s",
        cursor: "pointer",
      },
    },

    dPadUp,
    dPadDown,
    dPadLeft,
    dPadRight,
    dPadCenter,
    dPadLabel: {
      transform: "rotate(-45deg) scale(1.5)",
    },

    miscButtons: {
      textAlign: "center",
    },

    miscButton: {
      width: "54px",
      height: "54px",
      transform: "scale(1.4)",
      margin: theme.spacing(2),
    },
  };
  // eslint-disable-next-line
  return styles as any;
});

export const MediaView: React.FC<IMediaProps> = (props) => {
  const classes = useStyles({} as LocalStyles);
  const send = (cmd: string) => {
    props.item.send(cmd);
  };

  const size = `${(props.config.rows || 1) * 108}px`;

  return (
    <Grid container className={classes.root}>
      <Grid item xs={8}>
        <ButtonGroup variant="contained" color="primary" className={classes.dPad} style={{
          width: size,
          height: size,
        }}>
          <Button className={classes.dPadUp} onClick={() => send(props.config.commands.directionPad.up)}>
            <div className={classes.dPadLabel}>
              <Icon icon="material:ExpandLess" />
            </div>
          </Button>
          <Button className={classes.dPadRight} onClick={() => send(props.config.commands.directionPad.right)}>
            <div className={classes.dPadLabel}>
              <Icon icon="material:ChevronRight" />
            </div>
          </Button>
          <Button className={classes.dPadDown} onClick={() => send(props.config.commands.directionPad.down)}>
            <div className={classes.dPadLabel}>
              <Icon icon="material:ExpandMore" />
            </div>
          </Button>
          <Button className={classes.dPadLeft} onClick={() => send(props.config.commands.directionPad.left)}>
            <div className={classes.dPadLabel}>
              <Icon icon="material:ChevronLeft" />
            </div>
          </Button>
          <Button className={classes.dPadCenter} onClick={() => send(props.config.commands.select)}>
            <div className={classes.dPadLabel}>
            </div>
          </Button>
        </ButtonGroup>
      </Grid>

      <Grid container item xs={4} className={classes.miscButtons} justify="center" alignItems="center">
        <Grid item xs={12}>
          <Button color="primary"
            className={classes.miscButton}
            onClick={() => send(props.config.commands.play)}>
            <Icon icon="material:PlayArrow" />
          </Button>
          <Button color="primary"
            className={classes.miscButton}
            onClick={() => send(props.config.commands.pause)}>
            <Icon icon="material:Pause" />
          </Button>
        </Grid>
        <Grid item xs={12}>
          <Button color="primary"
            className={classes.miscButton}
            onClick={() => send(props.config.commands.skipBackwards)}>
            <Icon icon="material:SkipPrevious" />
          </Button>
          <Button color="primary"
            className={classes.miscButton}
            onClick={() => send(props.config.commands.skipForward)}>
            <Icon icon="material:SkipNext" />
          </Button>
        </Grid>
        <Grid item xs={12}>
          <Button color="primary"
            className={classes.miscButton}
            onClick={() => send(props.config.commands.volume.up)}>
            <Icon icon="material:VolumeDown" />
          </Button>
          <Button color="primary"
            className={classes.miscButton}
            onClick={() => send(props.config.commands.volume.up)}>
            <Icon icon="material:VolumeUp" />
          </Button>
        </Grid>
        <Grid item xs={12}>
          <Button color="primary"
            className={classes.miscButton}
            onClick={() => send(props.config.commands.back)}>
            <Icon icon="material:Undo" />
          </Button>
          <Button color="primary"
            className={classes.miscButton}
            onClick={() => send(props.config.commands.home)}>
            <Icon icon="material:Home" />
          </Button>
        </Grid>
      </Grid>
    </Grid>
  );
}
