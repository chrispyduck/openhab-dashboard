import React, { useContext } from "react";
import DataContext from "./DataContext";
import Dashboard from "./Dashboard";

const View: React.FC = () => {
  const data = useContext(DataContext);
  switch (data.currentView.type) {
    case "dashboard": {
      return <Dashboard configuration={data.currentView}/>;
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
