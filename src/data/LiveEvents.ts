import EventEmitter from "events";

export default class LiveEvents extends EventEmitter {
  constructor(url?: string) {
    super();
    if (url !== undefined)
      this.init(url);
  }

  private events: EventSource | undefined = undefined;

  init = (url: string) => {
    if (this.events !== undefined)
      throw new Error("Already initialized");
    this.events = new EventSource(url + "rest/events");
    this.events.onmessage = this.onEvent;
  }

  stop = () => {
    this.events?.close();
    this.events = undefined;
  }

  onEvent = (e: MessageEvent<string>): void => {
    if (e.type !== "message") return;
    const data = JSON.parse(e.data) as {
      payload: string,
      type: string,
      topic: string,
    };
    const payload = JSON.parse(data.payload) as unknown;
    switch (data.type) {
      case "ItemStateEvent": {
        const state = payload as ItemStateEvent;
        this.raiseItemStateChange({
          type: data.type,
          topic: data.topic,
          payload: state
        });
        break;
      }
      case "ItemStateChangedEvent": {
        const stateChange = payload as ItemStateChangedEvent;
        this.raiseItemStateChange({
          type: data.type,
          topic: data.topic,
          payload: stateChange
        });
        break;
      }
      default: {
        console.debug(`Unrecognized event payload type ${data.type} for ${data.topic}`, payload);
      }
    }
  }

  /**
   * @fires LiveEvents#ItemState
   */
  private raiseItemStateChange = (msg: EventMessage<ItemStateEvent>): void => {
    /**
     * @event LiveEvents#ItemState
     * @type {EventMessage<ItemStateEvent>}
     */
    this.emit("ItemState", msg);
  }
}

export interface EventMessage<TPayload> {
  topic: string;
  payload: TPayload;
  type: string;
}

export interface ItemStateEvent {
  type: string;
  value: string;
}

export interface ItemStateChangedEvent extends ItemStateEvent {
  oldType: string;
  oldValue: string;
}