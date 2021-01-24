import React, { useEffect, useState } from "react";
import { RouteComponentProps } from "react-router-dom";
import { default as DataContextClass } from "data/DataContext";

const instance = new DataContextClass();
const DataContext = React.createContext(instance);
export default DataContext;

interface IRootRouteParameters {
  config: string;
}

const Loading: React.FC = () => {
  return (
    <span>
      Loading...
    </span>
  );
}

function withConfiguration(Component: React.ComponentType): React.FC<RouteComponentProps<IRootRouteParameters>> {
  const wrapper: React.FC<RouteComponentProps<IRootRouteParameters>> = (props) => {
    useEffect(() => {
      instance.loadConfiguration(props.match.params.config);
      const listener = (): void => {
        setReady(true);
      };
      instance.on("ready", listener);
      return () => {
        instance.off("ready", listener);
      }
    }, [props.match.params.config]);

    const [ready, setReady] = useState(instance.isReady);

    return (
      <DataContext.Provider value={instance}>
        {ready
          ? <Component />
          : <Loading />}
      </DataContext.Provider>
    );
  };
  return wrapper;
}

export { withConfiguration };
