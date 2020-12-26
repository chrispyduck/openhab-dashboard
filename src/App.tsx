import React, { useContext, useState, useEffect } from "react";
import TopBar from "./components/TopBar";
import View from "./components/View";
import DataContext from "./components/DataContext";
import "./App.css";

const App: React.FC = () => {
  const context = useContext(DataContext);
  const [ready, setReady] = useState(context.isReady);

  useEffect(() => {
    context.on("ready", () => {
      setReady(true);
    });
  }, []);

  if (!ready)
    return (
      <div>Loading...</div>
    );

  return (
    <div className="App">
      <TopBar />
      <View />
    </div>
  );
};

export default App;
