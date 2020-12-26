import React from "react";
import { default as DataContextClass } from "../data/DataContext";

const instance = new DataContextClass();
const DataContext = React.createContext(instance);
export default DataContext;
