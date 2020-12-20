import React, { useContext } from "react";
import { observer } from "mobx-react-lite";
import DataContext from "./DataContext";
import { IViewConfiguration } from "../data/IConfiguration";

/**
 * The current view name, displayed in the app bar
 */
const CurrentView = ({ view }: { view: IViewConfiguration }) => {
  return (
    <span>
      {view.title}
    </span>
  );
};

const CurrentViewObserved = observer(CurrentView);

export default () => {
  const data = useContext(DataContext);
  return <CurrentViewObserved view={data.currentView} />;
};
