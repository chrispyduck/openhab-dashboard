import React, { useContext } from "react";
import { EmptyItem } from "data/Item";
import DataContext from "components/DataContext";
import { observer } from "mobx-react";
import { IMediaConfig, DefaultConfiguration } from "./IMediaConfig";
import { MediaView } from "./MediaView";
import { merge } from "lodash";

const MediaObserved = observer(MediaView);

const Media: React.FC<{ config: IMediaConfig }> = ({ config }) => {
  const context = useContext(DataContext);
  const fullConfig = merge({}, DefaultConfiguration, config);
  return <MediaObserved
    item={context.getItem(fullConfig.commandItem) || EmptyItem}
    config={fullConfig  } />;
};

export default Media;
