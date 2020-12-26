import LiveEvents, { EventMessage, ItemStateEvent } from "./LiveEvents";
import { IItemDisplaySettings } from "./configuration/Items";
import IConfiguration from "./configuration/Configuration";
import { IViewConfiguration } from "./configuration/Views";
import DefaultConfiguration from "./DefaultConfiguration";
import { merge } from "lodash";
import { makeObservable, observable, computed, runInAction } from "mobx";
import { Item } from "./Item";
import { ItemsApi } from "./api/Items";
import EventEmitter from "events";

export default class DataContext extends EventEmitter {
  constructor() {
    super();
    this.loadConfiguration().then(null, e => {
      console.error("Unhandled error loading config file", e);
    });

    this.events.on("ItemState", this.handleItemUpdate);

    makeObservable(this);
  }

  private async loadConfiguration(): Promise<void> {
    const response = await fetch("/config.json");
    const config = <IConfiguration>await response.json();
    this.configuration$ = merge({}, DefaultConfiguration, config);

    this.currentView = (this.configuration.defaultView)
      ? this.configuration.views[this.configuration.defaultView] || Object.values(this.configuration.views)[0]
      : Object.values(this.configuration.views)[0];

    this.baseUrl = `${this.configuration.openhab.ssl ? "https" : "http"}://${this.configuration.openhab.hostname}:${this.configuration.openhab.port}/rest`;
    console.debug(`Connecting to OpenHAB at ${this.baseUrl}`);

    this.events.init(this.baseUrl);
    this.itemsApi.baseUrl = this.baseUrl;
    this.isReady$ = true;
    this.emit("ready", true);
  }

  private readonly itemsApi = new ItemsApi();
  private readonly events = new LiveEvents();
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

  @observable
  private currentView$: IViewConfiguration | undefined = undefined;
  @computed
  public get currentView(): IViewConfiguration {
    if (!this.currentView$)
      throw new Error("No view has been initialized");
    return this.currentView$;
  }
  public set currentView(value: IViewConfiguration) {
    runInAction(() => {
      this.currentView$ = value;
    });
  }

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
