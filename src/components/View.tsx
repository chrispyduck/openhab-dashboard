import React, { useContext } from "react";
import DataContext from "./DataContext";
import Dashboard from "./Dashboard";
import { IViewConfiguration } from "../data/configuration/Views";
import TopBar from "./TopBar";
import { Switch, Route, Redirect, useRouteMatch } from "react-router-dom";

const resolveViewComponent = (type: string): React.FC<{ configuration: IViewConfiguration }> => {
  switch (type) {
    case "dashboard": {
      return Dashboard;
    }
    default: {
      throw new Error(`View type not supported: ${type}`);
    }
  }
}

const View: React.FC = () => {
  const data = useContext(DataContext);
  const { path, url } = useRouteMatch();
  return (
    <>
      <TopBar/>
      <Switch>
        <Route exact path={path}>
          <Redirect to={`${url}/${data.defaultViewKey}`}/>
        </Route>
        {Object.entries(data.configuration.views).map(([key, config]) => (
          <Route key={key} path={`${path}/${key}`} render={(routeProps) => {
            const Component = resolveViewComponent(config.type);
            return <Component {...routeProps} configuration={config}/>
          }}/>
        ))}
      </Switch>
    </>
  );
};

export default View;
