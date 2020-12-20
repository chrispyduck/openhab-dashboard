import { makeAutoObservable } from "mobx";
import * as api from "./api";
import LiveEvents from "./LiveEvents";

export default class MainPage {
  constructor() {
    makeAutoObservable(this);
  }

  private readonly liveEvents: LiveEvents = new LiveEvents("http://10.2.11.128:8080/");
  private readonly itemsApi: api.ItemsApi = new api.ItemsApi("http://10.2.11.128:8080/");
  
  temperature = "-- F";
  humidity = "-- %";

  
}
