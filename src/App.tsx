import React from "react";
import { BrowserRouter as Router, Redirect, Route } from "react-router-dom";
import View from "./components/View";
import { withConfiguration } from "./components/DataContext";
import "./App.css";

const ViewWithConfiguration = withConfiguration(View);

const App: React.FC = () => {
  return (
    <div className="App">
      <Router>
        <Route exact path="/">
          <Redirect to="/default"/>
        </Route>
        <Route path="/:config" component={ViewWithConfiguration}/>
      </Router>
    </div>
  );
};

export default App;
