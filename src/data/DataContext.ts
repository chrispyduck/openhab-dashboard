import LiveEvents, { EventMessage, ItemStateEvent } from "./LiveEvents";
import { IItemDisplaySettings } from "./configuration/Items";
import IConfiguration from "./configuration/Configuration";
import { IViewConfiguration, ViewType } from "./configuration/Views";
import DefaultConfiguration from "./DefaultConfiguration";
import { merge } from "lodash";
import { makeObservable, observable, computed, action } from "mobx";
import { Item } from "./Item";
import { ItemsApi } from "./api/Items";
import EventEmitter from "events";

export default class DataContext extends EventEmitter {
  constructor() {
    super();
    this.events.on("ItemState", this.handleItemUpdate);
    this.timer = setTimeout(this.checkForOutdatedItems, 60e3);
    makeObservable(this);
  }

  public async loadConfiguration(name: string): Promise<void> {
    const response = await fetch(`/config/${name}.json`);
    const config = <IConfiguration>await response.json();
    this.configuration$ = merge({}, DefaultConfiguration, config);

    this.setCurrentView(this.defaultViewKey);

    this.baseUrl = `${this.configuration.openhab.ssl ? "https" : "http"}://${this.configuration.openhab.hostname}:${this.configuration.openhab.port}/rest`;
    console.debug(`Connecting to OpenHAB at ${this.baseUrl}`);

    this.events.init(this.baseUrl);
    this.itemsApi.baseUrl = this.baseUrl;
    this.isReady$ = true;
    this.emit("ready", true);
  }

  private readonly itemsApi = new ItemsApi();
  private readonly events = new LiveEvents();
  private timer: NodeJS.Timeout;
  private baseUrl = "";

  @observable
  private isReady$ = false;

  /** Indicates whether the data context is initialized and ready for use */
  @computed
  public get isReady(): boolean {
    return this.isReady$;
  }

  @observable
  private configuration$: IConfiguration | undefined = undefined;
  public get configuration(): IConfiguration {
    if (this.configuration$)
      return this.configuration$;
    throw new Error("No configuration has been loaded");
  }

  @computed
  public get defaultViewKey(): string {
    return (this.configuration.defaultView)
      ? this.configuration.defaultView.toString()
      : Object.keys(this.configuration.views)[0].toString();
  }

  @computed
  public get defaultView(): ViewType {
    return (this.configuration.defaultView)
      ? this.configuration.views[this.configuration.defaultView] || Object.values(this.configuration.views)[0]
      : Object.values(this.configuration.views)[0];
  }

  public getViewByKey = (key: string): ViewType => {
    const match = this.configuration.views[key];
    if (key)
      return match;
    throw new Error(`No matching view for key: ${key}`);
  }

  @action
  public setCurrentView = (key: string): void => {
    const view = this.getViewByKey(key);
    this.currentViewKey$ = key;
    this.currentViewConfig$ = view;
  }

  @observable
  private currentViewConfig$: IViewConfiguration | undefined = undefined;
  @computed
  public get currentViewConfig(): IViewConfiguration {
    if (!this.currentViewConfig$)
      throw new Error("No view has been initialized");
    return this.currentViewConfig$;
  }

  @observable 
  private currentViewKey$ = "";
  
  @computed
  public get currentViewKey(): string {
    if (!this.currentViewKey$)
      throw new Error("No view has been initialized");
    return this.currentViewKey$;
  }

  private readonly items: { [key: string]: Item } = {};

  public getItem = (itemConfig?: IItemDisplaySettings | string): Item | undefined => {
    if (!itemConfig)
      return;
    if (typeof itemConfig === "string") {
      itemConfig = {
        show: true,
        itemName: itemConfig
      };
    }

    let item = this.items[itemConfig.itemName];
    if (!item) {
      item = new Item(itemConfig, this.itemsApi);
      this.items[itemConfig.itemName] = item;
    }
    return <Item>item;
  }

  private handleItemUpdate = (event: EventMessage<ItemStateEvent>): void => {
    //smarthome/items/unifi_ChrisPhone_PhoneRSSI/state = 31 (Decimal)
    const topicParts = event.topic.split("/");
    if (topicParts.length >= 4 && topicParts[1] == "items") {
      const item = this.items[topicParts[2]];
      if (item) {
        item.handleStatusEvent(topicParts[3], event);
        console.debug(`${event.topic} = ${event.payload.value} (${event.payload.type})`);
      }
    }
  }

  private checkForOutdatedItems = async (): Promise<void> => {
    const now = new Date().getTime();
    const threshold = now - 60e3; // 1 minute
    const items = Object.values(this.items);
    for (let i = 0; i < items.length; i++) {
      if (!!items[i] && items[i].getLastUpdated().getTime() < threshold) {
        console.warn(`Value for ${items[i].name} is stale. Refreshing.`);
        await items[i].fetchCurrentValue();
      }
    }
    this.timer = setTimeout(this.checkForOutdatedItems, 60e3);
  }
}
