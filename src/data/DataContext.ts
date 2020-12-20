import LiveEvents, { EventMessage, ItemStateEvent } from "./LiveEvents";
import * as api from "./api";
import IConfiguration, { IViewConfiguration, IItemTextDisplay } from "./IConfiguration";
import DefaultConfiguration from "./DefaultConfiguration";
import { merge } from "lodash";
import { makeAutoObservable } from "mobx";
import { Item, IItem } from "./Item";

export default class DataContext {
  constructor(configuration: IConfiguration) {
    this.configuration = merge({}, DefaultConfiguration, configuration);
    this.currentView = (this.configuration.defaultView) 
      ? this.configuration.views[this.configuration.defaultView] || Object.values(this.configuration.views)[0]
      : Object.values(this.configuration.views)[0];

    const url = `${this.configuration.openhab.ssl ? "https": "http"}://${this.configuration.openhab.hostname}:${this.configuration.openhab.port}/`;
    console.debug(`Connecting to OpenHAB at ${url}`);

    this.events = new LiveEvents(url);
    this.events.on("ItemState", this.handleItemUpdate);
    
    this.itemsApi = new api.ItemsApi(url + "rest");

    makeAutoObservable(this);
  }

  public readonly configuration: IConfiguration;

  public readonly events: LiveEvents;
  public readonly itemsApi: api.ItemsApi;

  private readonly items: { [key: string]: IItem } = {};
  public getItem = <TValue>(itemConfig: IItemTextDisplay): Item<TValue> => {
    let item = this.items[itemConfig.name];
    if (!item) {
      item = new Item<TValue>(itemConfig);
      item.fetchCurrentValue(this.itemsApi);
      this.items[itemConfig.name] = item;
    }
    return <Item<TValue>>item;
  }

  public currentView: IViewConfiguration;

  private handleItemUpdate = (event: EventMessage<ItemStateEvent>): void => {
    //smarthome/items/unifi_ChrisPhone_PhoneRSSI/state = 31 (Decimal)
    const topicParts = event.topic.split("/");
    if (topicParts.length >= 4 && topicParts[0] == "smarthome" && topicParts[1] == "items") {
      const item = this.items[topicParts[2]];
      if (item) {
        item.handleStatusEvent(topicParts[3], event);
        console.info(`${event.topic} = ${event.payload.value} (${event.payload.type})`);
      }
    } else {
      console.debug(`${event.topic} = ${event.payload.value} (${event.payload.type})`);
    }
  }
}
