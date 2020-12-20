import React, { useContext } from "react";
import { default as DataContextClass } from "../data/DataContext";
import config from "../config.json";

const DataContext = React.createContext(new DataContextClass(config));
export default DataContext;
