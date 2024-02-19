import * as React from "react";
import styles from "./FluentUiDropdown.module.scss";
import { Guid } from "@microsoft/sp-core-library";
import { IFluentUiDropdownProps } from "./IFluentUiDropdownProps";
import { Web } from "@pnp/sp/presets/all";
import "@pnp/sp/lists";
import "@pnp/sp/items";
import { SPFI } from "@pnp/sp";
import { getSP } from "../../../pnpjsConfig";
import { escape } from "@microsoft/sp-lodash-subset";
import { Dropdown, PrimaryButton, IDropdownOption } from "@fluentui/react";

let arr: any = [];
export interface IDropdownStates {
  singleValueDropdown: string;
  multiValueDropdown: any;
}

export default class FluentUiDropdown extends React.Component<
  IFluentUiDropdownProps,
  IDropdownStates
> {
  private setNewLinkFromList = (newLinkFromList: boolean) => {
    return newLinkFromList;
  };

  constructor(
    props: IFluentUiDropdownProps | Readonly<IFluentUiDropdownProps>
  ) {
    super(props);
    this.state = {
      singleValueDropdown: "",
      multiValueDropdown: [],
    };
  }

  public _sp: SPFI = getSP(this.props.context);

  /* public onDropdownChange = (event: React.FormEvent<HTMLDivElement>, item: IDropdownOption): void => {
    this.setState({ singleValueDropdown: item.key as string});
  } */

  public onDropdownMultiChange = async (
    event: React.FormEvent<HTMLDivElement>,
    item: IDropdownOption
  ): Promise<void> => {
    if (item.selected) {
      arr.push(item.key as string);
    } else {
      arr.indexOf(item.key) !== -1 && arr.splice(arr.indexOf(item.key), 1);
    }
    this.setState({ multiValueDropdown: arr });
    console.log("Array:" + arr);
  };

  private async Save(e: any) {
    // let web = Web(this.props.webURL);
    const adminlinksItems = await this._sp.web.lists
      .getById(this.props.listGuid2)
      .items.select()
      .orderBy("Title", true)();
    //   adminlinksItems.forEach((el)=>{ foreach(()=>)
    // })
    console.log("valgfri lenker:", this.state.multiValueDropdown);
    console.log(adminlinksItems);
    const newAdminlinksItems = adminlinksItems.filter((item) =>
      this.state.multiValueDropdown.includes(item.Id)
    );
    // newAdminlinksItems.forEach(async item => await this._sp.web.lists.getById(this.props.listGuid).items.add({
    //   Title: item.Title,
    //   Link: {
    //     Description: item.Title,
    //     Url: item.Link,
    //   },
    //   openinnewtab: item.openinnewtab }));
    newAdminlinksItems.forEach((item) => console.log(item));
    const list = this._sp.web.lists.getById(this.props.listGuid);
    for (const item of newAdminlinksItems) {
      // eslint-disable-next-line no-void
      void list.items.add({
        Title: item.Title,
        Link: {
          Description: item.Title,
          Url: item.Link.Url,
        },
        openinnewtab: item.openinnewtab,
        Icon: "Link",
      });
      console.log(item.Title, item.Link.Url, item.openinnewtab);
    }

    this.state.multiValueDropdown.length = 0;
    // await this._sp.web.lists.getById(this.props.listGuid).items.add({
    //   Title: Guid.newGuid().toString(),
    //   /* SingleValueDropdown: this.state.singleValueDropdown, */
    //   // MultiValueDropdown: { results: this.state.multiValueDropdown }

    // }).then(i => {
    //   console.log(i);
    // });
  }

  public render(): React.ReactElement<IFluentUiDropdownProps> {
    return (
      <div className={styles.fluentUiDropdown}>
        {/* <h1>Fluent UI Dropdown</h1> */}
        {/*   <Dropdown
          placeholder="Single Select Dropdown..."
          selectedKey={this.state.singleValueDropdown}
          label="Single Select Dropdown"
          options={this.props.singleValueOptions}
          onChange={this.onDropdownChange}
        />
        <br /> */}
        {console.log(this.props.multiValueOptions)}
        <Dropdown
          placeholder="Legg til valgfrie lenker"
          defaultSelectedKeys={this.state.multiValueDropdown}
          label="Valgfrie lenker"
          multiSelect
          options={this.props.multiValueOptions}
          onChange={this.onDropdownMultiChange}
        />
        <div>
          <br />
          <PrimaryButton
            onClick={(e) => {
              void this.Save(e);
              this.forceUpdate();
              //this.props.parentCallback(false); // Callback to parent that closes the dialog by setting the state in a parent hook to false
            }}
          >
            Legg til lenker
          </PrimaryButton>
          {/* <DefaultButton>Avbryt</DefaultButton> */}
        </div>
      </div>
    );
  }
}
