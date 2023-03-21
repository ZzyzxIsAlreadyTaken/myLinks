import * as React from "react";
import styles from "./MyLinks.module.scss";
import { IMyLinksProps } from "./IMyLinksProps";
import { escape } from "@microsoft/sp-lodash-subset";
import { SPFI } from "@pnp/sp";
import { useEffect, useState } from "react";
import { IMYLINKS, IMYADMINLINKS } from "../../../interfaces";
import { getSP } from "../../../pnpjsConfig";
import { Icon, IIconProps, PrimaryButton } from "@fluentui/react";
import { Placeholder } from "@pnp/spfx-controls-react/lib/Placeholder";
import { WebPartTitle } from "@pnp/spfx-controls-react/lib/WebPartTitle";
import { ActionButton } from "office-ui-fabric-react/lib/Button";
import { initializeIcons } from "office-ui-fabric-react/lib/Icons";

import { DefaultButton, IconButton } from "@fluentui/react/lib/Button";
import { useId, useBoolean } from "@fluentui/react-hooks";
import {
  Checkbox,
  Modal,
  Dropdown,
  TextField,
  DropdownMenuItemType,
  IDropdownOption,
} from "office-ui-fabric-react";
import { Item } from "@pnp/sp/items";
import { IconPicker } from "@pnp/spfx-controls-react/lib/IconPicker";
import FluentUiDropdown from "./FluentUiDropdown";

initializeIcons();

const addLinkIcon: IIconProps = { iconName: "AddLink" };
const addEditIcon: IIconProps = { iconName: "Edit" };
const addEdit2Icon: IIconProps = {
  iconName: 'Edit',
  styles: {root: {color: "green", fontColor: "green", }
},
  className: styles.editButtonIcon
};
const addDeleteIcon: IIconProps = { iconName: "Delete" };
const cancel: IIconProps = { iconName: "Cancel" };

const MyLinks = (props: IMyLinksProps) => {
  // * Hooks
  const [DeleteInfo, setDeleteInfo] = useState([]);
  const [currentIcon, setIcon] = useState("Link");
  const [currentForm, setCurrentForm] = useState({
    Title: "",
    Link: "",
    openinnewtab: false,
    Icon: "Link",
  });
  const [newLinkFromList, setNewLinkFromList] = useState(false);
  const [showEgendefinerte, setshowEgendefinerte] = useState(false);

  function addItemState() {
    const newItem = {} as IMYLINKS;

    const newMyLinks = [
      ...myLinksItems.map((item) => {
        item.edit = false;
        return item;
      }),
    ];

    newMyLinks.unshift(newItem);
    newItem.edit = true;
    newItem.add = true;
    newItem.Icon = "Link";
    console.log(newMyLinks);
    setMyLinksItems(newMyLinks);
  }

  function createItemInList() {
    const list = _sp.web.lists.getById(props.listGuid);
    console.log(list);
    console.log(currentForm.Title, currentIcon, currentForm.Link);
    list.items.add({
      Title: currentForm.Title,
      Icon: currentIcon,
      Link: {
        Description: currentForm.Title,
        Url: currentForm.Link,
      },
      openinnewtab: currentForm.openinnewtab
    });
    const newMyLinks = [
      ...myLinksItems.map((item) => {
        item.add = false;
        item.edit = false;
        return item;
      }),
    ];
    setMyLinksItems(newMyLinks);
  }

  function cancelButton() {
    console.log("Cancel");
    const newMyLinks = [
      ...myLinksItems.map((item) => {
        item.edit = false;
        return item;
      }),
    ];
    setMyLinksItems(newMyLinks);
  }

  function getEditItem(id: number, index: number) {
    const newMyLinks = [
      ...myLinksItems.map((item) => {
        item.edit = false;
        return item;
      }),
    ];
    newMyLinks[index].edit = true;
    setCurrentForm({
      Title: newMyLinks[index].Title,
      Link: newMyLinks[index].Link,
      openinnewtab: newMyLinks[index].openinnewtab,
      Icon: newMyLinks[index].Icon,
    });
    setIcon(newMyLinks[index].Icon);
    setMyLinksItems(newMyLinks);
  }

  function deleteItem(id: number, title: string): void {
    const list = _sp.web.lists.getById(props.listGuid);
    list.items.getById(id).delete();
    {
      myLinksItems.map(() =>
        setMyLinksItems(myLinksItems.filter((a) => a.Id !== id))
      );
    }
    let deleteInfoTXT = "Du har slettet: " + title;
    setDeleteInfo([deleteInfoTXT]);
  }

  function saveItem(id: number, index: number) {
    const list = _sp.web.lists.getById(props.listGuid);

    list.items.getById(id).update({
      Title: currentForm.Title,
      Icon: currentIcon,
      Link: {
        Description: currentForm.Title,
        Url: currentForm.Link,
      },
      openinnewtab: currentForm.openinnewtab,
    });
    const newMyLinks = [
      ...myLinksItems.map((item) => {
        item.edit = false;
        return item;
      }),
    ];
    newMyLinks[index].edit = false;
    newMyLinks[index].Title = currentForm.Title;
    newMyLinks[index].Link = currentForm.Link;
    newMyLinks[index].openinnewtab = currentForm.openinnewtab;
    newMyLinks[index].Icon = currentIcon;

    console.log(currentForm);
    setMyLinksItems(newMyLinks);
  }

  const LOG_SOURCE = "MyLinks Webpart";
  const LIST_NAME = "mylinks";

  let _sp: SPFI = getSP(props.context);

  //Mylinks Items
  const [myLinksItems, setMyLinksItems] = useState<IMYLINKS[]>([]);

  const getMyLinksItems = async () => {
    console.log("context", _sp);
    const items = _sp.web.lists
      .getById(props.listGuid)
      .items.select()
      .orderBy("Title", true)();

    console.log("mylinks Items", items);

    setMyLinksItems(
      (await items).map((item: any) => {
        return {
          Id: item.ID,
          Title: item.Title,
          Icon: item.Icon,
          Link: item.Link.Url,
          openinnewtab: item.openinnewtab,
          edit: false,
          add: false,
        };
      })
    );
  };

  //Myadminlinks items
  const [myAdminLinksItems, setMyAdminLinksItems] = useState<IMYADMINLINKS[]>(
    []
  );

  const getMyAdminLinksItems = async () => {
    console.log("context", _sp);
    const items = _sp.web.lists
      .getById(props.listGuid2)
      .items.select()
      .orderBy("Title", true)();

    console.log("mylinksAdmin Items", items);

    setMyAdminLinksItems(
      (await items).map((item: any) => {
        return {
          Id: item.ID,
          Title: item.Title,
          Link: item.Link.Url,
          openinnewtab: item.openinnewtab,
          Valgfri: item.Valgfri
        };
      })
    );
  };

  //

  const [isModalOpen, { setTrue: showModal, setFalse: hideModal }] =
    useBoolean(false);

  const titleId = useId("title");

  useEffect(() => {
    if (props.listGuid && props.listGuid != "") {
      getMyLinksItems();
    }
  }, [props]);

  useEffect(() => {
    if (props.listGuid2 && props.listGuid2 != "") {
      getMyAdminLinksItems();
    }
  }, [props]);

  // let newArray : {text: string, key: string|number} = []
  // myAdminLinksItems.map((o: IMYADMINLINKS, index: number) => {
  //   newArray.push()
  // })

  let optionsArray = myAdminLinksItems.filter((item) => {if (item.Valgfri == true){return {item}} }).map(item => ({text: item.Title, key: item.Id}))
  
  // console.log("optionsarray3",optionsArray3);
  const predefinedLinksOptions: IDropdownOption[] = optionsArray
  
  
  return (
    // <>
    // <h1>Hello World</h1>
    // <pre>{JSON.stringify(myLinksItems,null,2)}</pre>
    // </>
    <>
      {props.listGuid && props.listGuid2 ? (
        <>
          <WebPartTitle
            displayMode={props.displayMode}
            title={props.title}
            updateProperty={props.updateProperty}
          />
          
          <Modal
            titleAriaId={titleId}
            isOpen={isModalOpen}
            onDismiss={() => {
              hideModal();
              getMyLinksItems();
            }}
            isBlocking={false}
            forceFocusInsideTrap={false}
            containerClassName={styles.modalStyles}
          >
            <IconButton
              iconProps={cancel}
              onClick={() => {
                hideModal();
                getMyLinksItems();
              }}
            ></IconButton>
            <div className={styles.modalWrapper}>
              <h3>Rediger mine lenker</h3>
              <ActionButton
                iconProps={addLinkIcon}
                onClick={() => addItemState()}
                className={styles.newButtons}
              >
                Ny egendefinert lenke
              </ActionButton>
             
              <ActionButton
                iconProps={addLinkIcon}
                onClick={() => setNewLinkFromList(!newLinkFromList)}
                className={styles.newButtons}
              >
                Ny lenke fra liste
              </ActionButton>
              {newLinkFromList ? (
                <div className={styles.predefinedLinksContainer}>
                  <FluentUiDropdown
                    description={"Valgfrie lenker"}
                    webURL={""}
                    singleValueOptions={""}
                    multiValueOptions={predefinedLinksOptions}
                    listGuid={props.listGuid}
                    listGuid2={props.listGuid2}
                    context={props.context}
                  ></FluentUiDropdown>
                  <DefaultButton className={styles.lukkButton} onClick={() => {setNewLinkFromList(!newLinkFromList); console.log(predefinedLinksOptions)}}>Lukk</DefaultButton>
                </div>
              ) : (
                ""
              )}

              {myLinksItems.map((o: IMYLINKS, index: number) => {
                return (
                  <div key={index}>
                    {o.Title ? (
                      <>
                        <Icon iconName={o.Icon}></Icon>
                        <span className={styles.modalLinkTitle}>{o.Title}</span>
                        <IconButton
                          iconProps={addEditIcon}
                          onClick={() => getEditItem(o.Id, index)}
                        ></IconButton>
                        <IconButton
                          iconProps={addDeleteIcon}
                          onClick={() => deleteItem(o.Id, o.Title)}
                        ></IconButton>
                      </>
                    ) : (
                      ""
                    )}
                    {o.edit ? (
                      <div className={styles.editForm}>
                        <div className={styles.iconField}>
                          <Icon
                            iconName={currentIcon}
                            className={styles.editIcon}
                          ></Icon>
                        </div>
                        <div className={styles.iconField}>
                          <IconPicker
                            buttonLabel={"Sett ikon"}
                            onChange={(iconName: string) => {
                              setIcon(iconName);
                            }}
                            onSave={(iconName: string) => {
                              setIcon(iconName);
                            }}
                          />
                        </div>
                        <div className={styles.editFields}>
                          <TextField
                            label="Tittel"
                            defaultValue={o.Title}
                            className={styles.editInputFields}
                            onChange={(e: any) =>
                              setCurrentForm({
                                ...currentForm,
                                Title: e.target.value,
                              })
                            }
                            name="Title"
                          ></TextField>
                        </div>
                        <div className={styles.editFields}>
                          <TextField
                            label="Url"
                            defaultValue={o.Link}
                            className={styles.editInputFields}
                            onChange={(e: any) =>
                              setCurrentForm({
                                ...currentForm,
                                Link: e.target.value,
                              })
                            }
                            name="Link"
                          ></TextField>
                        </div>
                        <div className={styles.editFields}>
                          <Checkbox
                            label="Åpne lenke i nytt vindu"
                            checked={currentForm.openinnewtab}
                            onChange={(e: any) =>
                              setCurrentForm({
                                ...currentForm,
                                openinnewtab: !currentForm.openinnewtab,
                              })
                            }
                            name="openinnewtab"
                          ></Checkbox>
                        </div>
                        <div className={styles.editButtonsContainer}>
                          <PrimaryButton
                            onClick={() => {
                              o.add
                                ? createItemInList()
                                : saveItem(o.Id, index);
                            }}
                            className={styles.saveButtons}
                          >
                            Lagre
                          </PrimaryButton>
                          <DefaultButton
                            onClick={() => {
                              cancelButton();
                            }}
                          >
                            Avbryt
                          </DefaultButton>
                        </div>
                      </div>
                    ) : (
                      ""
                    )}
                  </div>
                );
              })}
              <span className={styles.deleteInfo}>{DeleteInfo}</span>
            </div>
          </Modal>
        </>
      ) : (
        ""
      )}
      {/* Adminlinks */}
      <div className={styles.linkHeader}>Felleslenker</div>
      {props.listGuid && props.listGuid2
        ? myAdminLinksItems.filter((item) => {if (item.Valgfri == false){return {item}} }).map((o: IMYADMINLINKS, index: number) => { 
            return (
              <div key={index}>
                <Icon iconName="Link"></Icon>
                {o.openinnewtab ? (
                  <>
                    {" "}
                    <a href={o.Link} rel="noreferrer" target="_blank">
                      {o.Title}
                    </a>
                  </>
                ) : (
                  <>
                    {" "}
                    <a href={o.Link} rel="noreferrer" target="_self">
                      {o.Title}
                    </a>
                  </>
                )}
              </div>
            );
          })
        : ""}
      {/* My links */}
      {props.listGuid && props.listGuid2 ? (
        <div className={styles.linkHeader}>Egendefinerte lenker <Icon onClick={() => setshowEgendefinerte(!showEgendefinerte)} iconName={showEgendefinerte ? "ChevronDown" : "ChevronUp"}></Icon></div>
      ) : (
        ""
      )}
      {props.listGuid && props.listGuid2 ? (<>{showEgendefinerte ?  <>{myLinksItems.map((o: IMYLINKS, index: number) => {
          return (
            <div key={index}>
              <Icon iconName={o.Icon}></Icon>
              {o.openinnewtab ? (
                <>
                  {" "}
                  <a href={o.Link} rel="noreferrer" target="_blank">
                    {o.Title}
                  </a>
                </>
              ) : (
                <>
                  {" "}
                  <a href={o.Link} rel="noreferrer" target="_self">
                    {o.Title}
                  </a>
                </>
              )}
            </div>
          );
        })}</>  : ""}
       
        <br />
        <ActionButton
        className={`${styles.button} ms-fontColor-black`}
        shape="rounded"
        iconProps={addEdit2Icon}
        onClick={() => {
          showModal();
          setDeleteInfo([""]);
          setNewLinkFromList(false);
        }}
      >
        Rediger lenker
      </ActionButton>
      </>
      ) : (
        <Placeholder
          iconName="Edit"
          iconText="Configure your web part"
          description="Please configure the web part."
          buttonLabel="Configure"
          onConfigure={() => props.context.propertyPane.open()}
          //  theme={this.props.themeVariant}
        />
      )}
    </>
  );
};

export default MyLinks;
