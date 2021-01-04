import { IItemDisplaySettings } from "./configuration/Items";
import { makeAutoObservable, runInAction, observable, computed, action } from "mobx";
import { EventMessage, ItemStateEvent } from "./LiveEvents";
import { ItemsApi } from "./api/Items";
import { debounce } from "lodash";

export class Item {
  constructor(config?: IItemDisplaySettings, client?: ItemsApi, value?: string) {
    if (!config) {
      this.name = "default";
      this.show = false;
      this.isEmpty = true;
    }
    else {
      this.name = config.itemName;
      this.show = config.show;
      this.client = client;
      if (value)
        this.value$ = value;
      makeAutoObservable(this);
      this.fetchCurrentValue().then(null, e => {
        console.error(`Failed to obtain information for item ${this.name}`, e);
      });
    }
  }

  private readonly client: ItemsApi | undefined;
  public readonly isEmpty: boolean = false;
  public readonly name: string;
  public readonly show: boolean;

  @observable public type = "unknown";
  @observable public category = "unknown";
  @observable public supportedCommands: Array<{
    command: string,
    displayName: string
  }> = [];

  @observable
  private displayName$: string | undefined;

  @computed
  public getDisplayName = (): string => {
    return this.displayName$ || this.name;
  };

  @observable
  private value$: string | undefined = undefined;

  @computed
  public getValue = (): string | undefined => {
    return this.value$;
  }

  @action
  public setValue = (val: string | undefined): void => {
    this.value$ = val;
    if (val !== undefined)
      this.sendDebounced(val);
  }

  @action
  public handleStatusEvent = (field: string, event: EventMessage<ItemStateEvent>): void => {
    if (field == "state") {
      runInAction(() => {
        this.value$ = event.payload.value;
      });
    }
  }

  @action
  public fetchCurrentValue = async (): Promise<void> => {
    if (!this.client)
      return;
    const detail = await this.client.getDetailAsync(this.name);
    runInAction(() => {
      this.displayName$ = detail.label || detail.name;
      this.value$ = detail.state;
      this.type = detail.type;
      this.category = detail.category;
      this.supportedCommands.length = 0;
      detail.commandDescription
        ?.commandOptions
        ?.map(cmd => ({ command: cmd.command, displayName: cmd.label }))
        ?.forEach(cmd => this.supportedCommands.push(cmd));
    });
  }

  @action
  public send = async (value: string): Promise<void> => {
    if (!this.client)
      return;
    console.log(`Item[${this.name}].state -> ${value}`);
    await this.client.sendCommandAsync(this.name, value);
  }

  private sendDebounced = debounce(this.send, 250, {
    leading: true,
    trailing: true,
    maxWait: 800,
  });
}

export const EmptyItem = new Item();
