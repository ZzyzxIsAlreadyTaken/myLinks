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
const ChevronDownIcon: IIconProps = { iconName: "ChevronDown"}
const ChevronUpIcon: IIconProps = { iconName: "ChevronUp"}

const MyLinks = (props: IMyLinksProps) => {
  // * Hooks
   //Mylinks Items
  const [myLinksItems, setMyLinksItems] = useState<IMYLINKS[]>([]);
  const [DeleteInfo, setDeleteInfo] = useState([]);
  const [currentIcon, setIcon] = useState("Link");
  const [currentForm, setCurrentForm] = useState({
    Title: "",
    Link: "",
    openinnewtab: false,
    Icon: "Link",
    Sortering: null,
  });
  const [newLinkFromList, setNewLinkFromList] = useState(false);
  const [showEgendefinerte, setshowEgendefinerte] = useState(false);
  const [showFelleslenker, setshowFelleslenker] = useState(false);
  const [showLagreSorteringsButton, setShowLagreSorteringsButton] = useState(false);

  const _sp: SPFI = getSP(props.context);
  const [batchedSP, execute] = _sp.batched();

  function addItemState() {
    const newItem = {} as IMYLINKS;

    const newMyLinks = [
      ...myLinksItems.map((item) => {
        item.edit = false;
        return item;
      }),
    ];

    const lastItemValueInnewMyLinks = newMyLinks[newMyLinks.length -1].Sortering

    newMyLinks.unshift(newItem);
    newItem.edit = true;
    newItem.add = true;
    newItem.Icon = "Link";
    newItem.Sortering = lastItemValueInnewMyLinks + 1;
    currentForm.Sortering = newItem.Sortering;
    console.log(newItem.Sortering);
    console.log(newMyLinks);
    setMyLinksItems(newMyLinks);
  }

  function closeEditForms(): void{
    const newMyLinks = [
      ...myLinksItems.map((item) => {
        item.edit = false;
        return item;
      }),
    ];
    setMyLinksItems(newMyLinks);
  }

  function createItemInList(): void {
    const list = _sp.web.lists.getById(props.listGuid);
    console.log(list);
    console.log(currentForm.Title, currentIcon, currentForm.Link, currentForm.Sortering);
    list.items.add({
      Title: currentForm.Title,
      Icon: currentIcon,
      Link: {
        Description: currentForm.Title,
        Url: currentForm.Link,
      },
      openinnewtab: currentForm.openinnewtab,
      Sortering: currentForm.Sortering,
    });
    const newMyLinks = [
      ...myLinksItems.map((item) => {
        item.add = false;
        item.edit = false;
        return item;
      }),
    ];
    newMyLinks.push({
      Id: 99,
      Title: currentForm.Title,
      Link: currentForm.Link,
      Icon: currentIcon, 
      openinnewtab: currentForm.openinnewtab,
      edit: false,
      add: false,
      Sortering: currentForm.Sortering
    })
    console.log(newMyLinks[newMyLinks.length -1])
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
      Sortering: newMyLinks[index].Sortering,
    });
    setIcon(newMyLinks[index].Icon);
    setMyLinksItems(newMyLinks);
  }

  function deleteItem(id: number, title: string): void {
    const list = _sp.web.lists.getById(props.listGuid);
    list.items.getById(id).delete();
    
    const removedItem = myLinksItems.find(item => item.Id === id)
    console.log(removedItem.Sortering + removedItem.Title)  
    setMyLinksItems(myLinksItems.filter((a) => a.Id !== id))

    const newMyLinks = [
      ...myLinksItems.map((item) => {
        item.Sortering > removedItem.Sortering ? item.Sortering-- : ""
        return item;
      }),
    ];
      
    setMyLinksItems(newMyLinks);
    saveMultipleListItems();
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
      Sortering: currentForm.Sortering,
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



  const getMyLinksItems = async () => {
    console.log("context", _sp);
    const items = _sp.web.lists
      .getById(props.listGuid)
      .items.select()
      .orderBy("Sortering", true)();

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
          Sortering: item.Sortering
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
      .orderBy("Sortering", true)();

    console.log("mylinksAdmin Items", items);

    setMyAdminLinksItems(
      (await items).map((item: any) => {
        return {
          Id: item.ID,
          Title: item.Title,
          Link: item.Link.Url,
          openinnewtab: item.openinnewtab,
          Valgfri: item.Valgfri,
          Sortering: item.Sortering
        };
      })
    );
  };

  function sortLinks(index:number, sortUp:boolean){

    const newMyLinks = [
      ...myLinksItems.map((item) => {
        return item;
      }),
    ];
    if(sortUp) {
      newMyLinks[index].Sortering =  newMyLinks[index + 0].Sortering + 1 
      newMyLinks[index + 1].Sortering = newMyLinks[index + 1].Sortering - 1
    } else {
      newMyLinks[index].Sortering =  newMyLinks[index + 0].Sortering + - 1 
      newMyLinks[index + - 1].Sortering = newMyLinks[index + - 1].Sortering + 1
    }
    
    
    newMyLinks.sort((s1, s2) => {
      return s1.Sortering - s2.Sortering;
  });

    setMyLinksItems(newMyLinks);
    setShowLagreSorteringsButton(true);
  }
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

  const saveMultipleListItems = async () => {
    const list = batchedSP.web.lists.getById(props.listGuid);
    myLinksItems.forEach(item => {
      list.items.getById(item.Id).update({ 
        Sortering: item.Sortering
      }).then(b => {
      console.log(b);
      });
      // Executes the batched calls
      
    });
    await execute();
  }

  let optionsArray = myAdminLinksItems.filter((item) => {if (item.Valgfri == true){return {item}} }).map(item => ({text: item.Title, key: item.Id}))
  

  const predefinedLinksOptions: IDropdownOption[] = optionsArray
  
  
  return (

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
                onClick={() => {addItemState(); newLinkFromList ? setNewLinkFromList(!newLinkFromList) : ""}}
                className={styles.newButtons}
              >
                Ny egendefinert lenke
              </ActionButton>
             
              <ActionButton
                iconProps={addLinkIcon}
                onClick={() => {setNewLinkFromList(!newLinkFromList);closeEditForms()}}
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
                  <DefaultButton className={styles.lukkButton} onClick={() => {setNewLinkFromList(!newLinkFromList); getMyLinksItems()}}>Lukk</DefaultButton>
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
                        {index == 0 ? <><IconButton iconProps={ChevronDownIcon} onClick={()=>sortLinks(index, true)}></IconButton></> : "" }
                        {index > 0 ? <><IconButton iconProps={ChevronUpIcon} onClick={()=>sortLinks(index, false)}></IconButton></> : "" }
                        {(index > 0 && index < myLinksItems.length - 1) ? <><IconButton iconProps={ChevronDownIcon} onClick={()=>sortLinks(index, true)}></IconButton></> : "" }
                      </>
                    ) : (
                      ""
                    )}
                    {o.edit ? (
                      <div className={styles.editForm}>
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
              {showLagreSorteringsButton ? <DefaultButton onClick={()=>{saveMultipleListItems(); setShowLagreSorteringsButton(false)}}>Lagre ny sortering</DefaultButton>: ""}
            </div>
          </Modal>
        </>
      ) : (
        ""
      )}
      {/* Adminlinks */}
      <div className={styles.linkHeader}>Felleslenker <Icon style={{cursor: "pointer"}} onClick={() => setshowFelleslenker(!showFelleslenker)} iconName={showFelleslenker ? "ChevronDown" : "ChevronUp"}></Icon></div>
      {props.listGuid && props.listGuid2
        ? (showFelleslenker ? <>{myAdminLinksItems.filter((item) => {if (item.Valgfri == false){return {item}} }).map((o: IMYADMINLINKS, index: number) => { 
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
      }</> : ""): ""}
      {/* My links */}
      {props.listGuid && props.listGuid2 ? (
        <div className={styles.linkHeader}>Egendefinerte lenker <Icon style={{cursor: "pointer"}} onClick={() => setshowEgendefinerte(!showEgendefinerte)} iconName={showEgendefinerte ? "ChevronDown" : "ChevronUp"}></Icon></div>
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
