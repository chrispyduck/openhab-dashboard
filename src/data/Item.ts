import { IItemTextDisplay } from "./IConfiguration";
import { makeAutoObservable } from "mobx";
import * as api from "./api";
import { EventMessage, ItemStateEvent } from "./LiveEvents";

export interface IItem extends IItemTextDisplay {
  fetchCurrentValue(client: api.ItemsApi): Promise<void>;
  handleStatusEvent(field: string, event: EventMessage<ItemStateEvent>): void;
}

export class Item<TValue> implements IItem {
  constructor(config: IItemTextDisplay, value?: TValue) {
    this.name = config.name;
    this.show = config.show;
    if (value)
      this.value$ = value;
    makeAutoObservable(this);
  }

  public readonly name: string;
  public readonly show: boolean;

  private value$: TValue | undefined = undefined;
  public get value(): TValue | undefined {
    return this.value$;
  }
  public set value(val: TValue | undefined) {
    this.value$ = val;
  }

  public handleStatusEvent = (field: string, event: EventMessage<ItemStateEvent>): void => {
    if (field == "state") {
      this.value$ = <TValue><unknown>event.payload.value;
    }
  }

  public fetchCurrentValue = async (client: api.ItemsApi): Promise<void> => {
    const result = await client.getItemData(this.name);
    this.value$ = <TValue><unknown>result.body.state; //todo: convert and interpret
  }
}
