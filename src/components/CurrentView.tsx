import React, { useContext } from "react";
import { observer } from "mobx-react";
import DataContext from "./DataContext";
import { IViewConfiguration } from "../data/configuration/Views";

/**
 * The current view name, displayed in the app bar
 */
const CurrentViewView: React.FC<{ view: IViewConfiguration }> = ({ view }) => {
  return (
    <span>
      {view.title}
    </span>
  );
};

const CurrentViewObserved = observer(CurrentViewView);

const CurrentView: React.FC = () => {
  const data = useContext(DataContext);
  return <CurrentViewObserved view={data.currentView} />;
};

export default CurrentView;