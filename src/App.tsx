import React from "react";
import { BrowserRouter as Router, Redirect, Route } from "react-router-dom";
import View from "./components/View";
import { withConfiguration } from "./components/DataContext";
import "./App.css";
import { GoogleAuthHelper } from "components/screensavers/GooglePhotoFrame";

const ViewWithConfiguration = withConfiguration(View);

const App: React.FC = () => {
  return (
    <div className="App">
      <Router>
        <Route path="/google-auth" component={GoogleAuthHelper}/>
        <Route exact path="/">
          <Redirect to="/default"/>
        </Route>
        <Route path="/:config" component={ViewWithConfiguration}/>
      </Router>
    </div>
  );
};

export default App;
