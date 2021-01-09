
import { IDashboardItem, IDisplaySettings } from "../../../data/configuration/Items";

export const DefaultConfiguration: IMediaConfig = {
  type: "media",
  show: true,
  cols: 12,
  commandItem: "",
  commands: {
    play: "Play",
    pause: "Pause",
    stop: "Stop",
    directionPad: {
      up: "DirectionUp",
      down: "DirectionDown",
      left: "DirectionLeft",
      right: "DirectionRight",
    },
    volume: {
      up: "VolumeUp",
      down: "VolumeDown",
    },
    select: "Select",
    fastForward: "FastForward",
    skipForward: "SkipForward",
    rewind: "Rewind",
    skipBackwards: "SkipBackward",
  }
}

export interface IMediaConfig extends IDashboardItem, IDisplaySettings {
  type: "media",

  /**
   * The name of the Item to which commands will be sent
   */
  commandItem: string;

  commands: {
    play: string,
    pause: string,
    stop: string,
    directionPad: {
      up: string,
      down: string,
      left: string,
      right: string,
    },
    volume: {
      up: string,
      down: string,
    },
    select: string,
    fastForward: string,
    skipForward: string,
    rewind: string,
    skipBackwards: string,
  }
}