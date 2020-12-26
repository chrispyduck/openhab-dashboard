import React, { useContext } from "react";
import DataContext from "./DataContext";
import Dashboard from "./Dashboard";
import { IDashboardConfiguration } from "../data/configuration/Views";

const View: React.FC = () => {
  const data = useContext(DataContext);
  switch (data.currentView.type) {
    case "dashboard": {
      return <Dashboard configuration={data.currentView as IDashboardConfiguration}/>;
    }
    default: {
      return (
        <span>
          View type not supported: {data.currentView.type}
        </span>
      );
    }
  }
};

export default View;
