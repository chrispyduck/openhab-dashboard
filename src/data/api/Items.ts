export interface IStateOption {
  value: string;
  label: string
}

export interface IStateDescription {
  pattern: string;
  readOnly: boolean;
  options: Array<IStateOption>
}

export interface ICommandOption {
  command: string;
  label: string;
}

export interface ICommandDescription {
  commandOptions: Array<ICommandOption>;
}

export interface IItemDetail {
  link: string;
  state: string;
  editable: boolean;
  commandDescription: ICommandDescription;
  stateDescription: IStateDescription;
  type: "String",
  name: string;
  label: string;
  category: string;
  tags: Array<string>;
  groupName: Array<string>;
}

export class ItemsApi {
  public baseUrl = "";

  public sendCommandAsync = async (item: string, value: string): Promise<void> => {
    const options = {
      method: "POST",
      headers: {
        "Content-Type": "text/plain"
      },
      body: value,
    };

    const response = await fetch(`${this.baseUrl}/items/${item}`, options);
    await response.text();
  }

  public sendCommandSync = (item: string, value: string): void => {
    this.sendCommandAsync(item, value).catch(err => {
      console.log(`Error in ItemsApi.setState(${item})`, err);
    });
  }

  public getStateAsync = async (item: string): Promise<string> => {
    const options = {
      method: "GET",
      headers: {
        "Content-Type": "text/plain"
      },
    };

    const response = await fetch(`${this.baseUrl}/items/${item}/state`, options);
    const data = await response.text();
    return data;
  }

  public getDetailAsync = async (item: string): Promise<IItemDetail> => {
    const options = {
      method: "GET",
    };

    const response = await fetch(`${this.baseUrl}/items/${item}`, options);
    const data = await response.json();
    return data;
  }
}
