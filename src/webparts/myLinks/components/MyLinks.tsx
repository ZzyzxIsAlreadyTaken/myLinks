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
  TextField,
  IDropdownOption,
} from "office-ui-fabric-react";
import { Item } from "@pnp/sp/items";
import { IconPicker } from "@pnp/spfx-controls-react/lib/IconPicker";
import FluentUiDropdown from "./FluentUiDropdown";

initializeIcons();

const addLinkIcon: IIconProps = { iconName: "AddLink" };
const addEditIcon: IIconProps = { iconName: "Edit" };
const addEdit2Icon: IIconProps = {
  iconName: "Edit",
  styles: { root: { color: "green", fontColor: "green" } },
  className: styles.editButtonIcon,
};
const addDeleteIcon: IIconProps = { iconName: "Delete" };
const cancel: IIconProps = { iconName: "Cancel" };
const ChevronDownIcon: IIconProps = { iconName: "ChevronDown" };
const ChevronUpIcon: IIconProps = { iconName: "ChevronUp" };

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
const MyLinks = (props: IMyLinksProps) => {
  // * Hooks
  //Mylinks Items
  const [myLinksItems, setMyLinksItems] = useState<IMYLINKS[]>([]);
  const [DeleteInfo, setDeleteInfo] = useState("");
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
  const [showFelleslenkerHeader, setshowFelleslenkerHeader] = useState(false);
  const [showLagreSorteringsButton, setShowLagreSorteringsButton] =
    useState(false);
  //Url validation
  const [urlIsValid, setUrlIsValid] = useState(false);
  const [titleHasContent, setTitleHasContent] = useState(false);

  const urlregexCheck = (urlString: string) => {
    const urlPattern = new RegExp(
      "^(https?:\\/\\/)?" + // validate protocol
        "((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|" + // validate domain name
        "((\\d{1,3}\\.){3}\\d{1,3}))" + // validate OR ip (v4) address
        "(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*" + // validate port and path
        "(\\?[;&a-z\\d%_.~+=-]*)?" + // validate query string
        "(\\#[-a-z\\d_]*)?$",
      "i"
    ); // validate fragment locator
    return !!urlPattern.test(urlString);
  };

  const _sp: SPFI = getSP(props.context);
  const [batchedSP, execute] = _sp.batched();

  function addItemState(): void {
    const newItem = {} as IMYLINKS;

    const newMyLinks = [
      ...myLinksItems.map((item) => {
        item.edit = false;
        return item;
      }),
    ];

    let lastItemValueInnewMyLinks = 0;

    if (newMyLinks.length > 0) {
      lastItemValueInnewMyLinks = newMyLinks[newMyLinks.length - 1].Sortering;
    }

    newMyLinks.push(newItem);
    newItem.edit = true;
    newItem.add = true;
    newItem.Icon = "Link";
    newItem.Sortering = lastItemValueInnewMyLinks + 1;
    currentForm.Icon = "Link";
    currentForm.Sortering = newItem.Sortering;
    console.log(newItem.Sortering);
    console.log(newMyLinks);
    setMyLinksItems(newMyLinks);
  }

  function closeEditForms(): void {
    const newMyLinks = [
      ...myLinksItems.map((item) => {
        item.edit = false;
        return item;
      }),
    ];
    setMyLinksItems(newMyLinks);
  }
  const getMyLinksItems = async (): Promise<void> => {
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
          Sortering: item.Sortering,
        };
      })
    );
  };

  async function createItemInList(): Promise<void> {
    const list = _sp.web.lists.getById(props.listGuid);
    console.log(list);
    console.log(
      currentForm.Title,
      currentIcon,
      currentForm.Link,
      currentForm.Sortering
    );
    await list.items.add({
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
    setMyLinksItems(newMyLinks);
    console.log(myLinksItems);
    // eslint-disable-next-line no-void
    void getMyLinksItems();

    // newMyLinks.push({
    //   Id: null,
    //   Title: currentForm.Title,
    //   Link: currentForm.Link,
    //   Icon: currentIcon,
    //   openinnewtab: currentForm.openinnewtab,
    //   edit: false,
    //   add: false,
    //   Sortering: currentForm.Sortering
    // })
    // console.log(newMyLinks[newMyLinks.length -1])
  }

  function cancelButton(): void {
    console.log("Cancel");
    const newMyLinks = [
      ...myLinksItems.map((item) => {
        item.edit = false;
        return item;
      }),
    ];
    setMyLinksItems(newMyLinks);
  }

  function getEditItem(id: number, index: number): void {
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

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const saveMultipleListItems = (arr: any): void => {
    console.log("-------Kjører saveMultipleListItems---------");
    const list = batchedSP.web.lists.getById(props.listGuid);
    arr.forEach(
      async (
        item: { Title: any; Sortering: any; Id: number },
        index: number
      ) => {
        console.log(item.Title + item.Sortering);
        await list.items
          .getById(item.Id)
          .update({
            Sortering: index + 1,
          })
          .then((b) => {
            console.log("sorterer:", b);
          });
        // Executes the batched calls
      }
    );
    // eslint-disable-next-line no-void
    void execute();
    setMyLinksItems(arr);
  };

  // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
  function deleteItem(id: number, title: string) {
    console.log("-------Kjører deleteITem---------");
    const list = _sp.web.lists.getById(props.listGuid);
    // eslint-disable-next-line no-void
    void list.items.getById(id).delete();

    const removedItem = myLinksItems.find((item) => item.Id === id);
    console.log("Fjernet lenke: ", removedItem.Sortering + removedItem.Title);

    const filteredLinks = myLinksItems.filter((a) => a.Id !== id);

    console.log("Filteredlinks ", filteredLinks);

    console.log("MyLinksItems ", myLinksItems);
    saveMultipleListItems(filteredLinks);

    // eslint-disable-next-line no-void

    const deleteInfoTXT = "Du har slettet: " + title;
    setDeleteInfo(deleteInfoTXT);
  }

  async function saveItem(id: number, index: number): Promise<void> {
    const list = _sp.web.lists.getById(props.listGuid);

    await list.items.getById(id).update({
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

    setMyLinksItems(newMyLinks);
  }

  //Myadminlinks items
  const [myAdminLinksItems, setMyAdminLinksItems] = useState<IMYADMINLINKS[]>(
    []
  );

  const getMyAdminLinksItems = async (): Promise<void> => {
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
          Sortering: item.Sortering,
        };
      })
    );
  };

  function sortLinks(index: number, sortUp: boolean) {
    const newMyLinks = [
      ...myLinksItems.map((item) => {
        return item;
      }),
    ];
    if (sortUp) {
      newMyLinks[index].Sortering = newMyLinks[index + 0].Sortering + 1;
      newMyLinks[index + 1].Sortering = newMyLinks[index + 1].Sortering - 1;
    } else {
      newMyLinks[index].Sortering = newMyLinks[index + 0].Sortering + -1;
      newMyLinks[index + -1].Sortering = newMyLinks[index + -1].Sortering + 1;
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
    if (props.listGuid && props.listGuid !== "") {
      // eslint-disable-next-line no-void
      void getMyLinksItems();
    }
  }, [props]);

  useEffect(() => {
    if (props.listGuid2 && props.listGuid2 !== "") {
      // eslint-disable-next-line no-void
      void getMyAdminLinksItems();
    }
  }, [props]);

  const optionsArray = myAdminLinksItems
    .filter((item) => {
      if (item.Valgfri === true) {
        return { item };
      }
    })
    .map((item) => ({ text: item.Title, key: item.Id }));

  const predefinedLinksOptions: IDropdownOption[] = optionsArray;

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
              void getMyLinksItems();
            }}
            isBlocking={false}
            forceFocusInsideTrap={false}
            containerClassName={styles.modalStyles}
          >
            <IconButton
              iconProps={cancel}
              onClick={() => {
                hideModal();
                void getMyLinksItems();
              }}
            />
            <div className={styles.modalWrapper}>
              <h3>Rediger mine lenker</h3>
              <ActionButton
                iconProps={addLinkIcon}
                onClick={() => {
                  addItemState();
                  newLinkFromList ? setNewLinkFromList(!newLinkFromList) : "";
                  setIcon("Link");
                  setDeleteInfo("");
                }}
                className={styles.newButtons}
              >
                Ny egendefinert lenke
              </ActionButton>

              <ActionButton
                iconProps={addLinkIcon}
                onClick={() => {
                  setNewLinkFromList(!newLinkFromList);
                  closeEditForms();
                  setDeleteInfo("");
                }}
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
                  />
                  {/* eslint-disable-next-line no-void */}
                  <DefaultButton
                    className={styles.lukkButton}
                    onClick={() => {
                      setNewLinkFromList(!newLinkFromList);
                      void getMyLinksItems();
                    }}
                  >
                    Lukk
                  </DefaultButton>
                </div>
              ) : (
                ""
              )}

              {myLinksItems.map((o: IMYLINKS, index: number) => {
                return (
                  <div key={index} className={styles.links}>
                    {o.Title ? (
                      <>
                        <Icon
                          iconName={o.Icon}
                          className={styles.webpartLinkIcon}
                        />
                        <span className={styles.modalLinkTitle}>{o.Title}</span>
                        <IconButton
                          iconProps={addEditIcon}
                          onClick={() => getEditItem(o.Id, index)}
                        />
                        <IconButton
                          iconProps={addDeleteIcon}
                          // eslint-disable-next-line no-void
                          onClick={() => {
                            void deleteItem(o.Id, o.Title);
                          }}
                        />
                        <span className={styles.sortChevronButtons}>
                          {index === 0 ? (
                            <>
                              <IconButton
                                iconProps={ChevronDownIcon}
                                onClick={() => sortLinks(index, true)}
                              />
                            </>
                          ) : (
                            ""
                          )}
                          {index > 0 ? (
                            <>
                              <IconButton
                                iconProps={ChevronUpIcon}
                                onClick={() => sortLinks(index, false)}
                              />
                            </>
                          ) : (
                            ""
                          )}
                          {index > 0 && index < myLinksItems.length - 1 ? (
                            <>
                              <IconButton
                                iconProps={ChevronDownIcon}
                                onClick={() => sortLinks(index, true)}
                              />
                            </>
                          ) : (
                            ""
                          )}
                        </span>
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
                            onChange={(
                              e: React.ChangeEvent<HTMLInputElement>
                            ) => {
                              setCurrentForm({
                                ...currentForm,
                                Title: e.target.value,
                              });
                              setTitleHasContent(e.target.value.length > 0);
                            }}
                            name="Title"
                          />
                          {titleHasContent ? (
                            <br />
                          ) : (
                            <span>Tittel må fylles ut</span>
                          )}
                        </div>
                        <div className={styles.editFields}>
                          <TextField
                            label="Url"
                            defaultValue={o.Link}
                            className={styles.editInputFields}
                            value={currentForm.Link}
                            onChange={(
                              e: React.ChangeEvent<HTMLInputElement>
                            ) => {
                              setCurrentForm({
                                ...currentForm,
                                Link: e.target.value,
                              });
                              setUrlIsValid(urlregexCheck(e.target.value));
                            }}
                            name="Link"
                            placeholder="https://"
                          />
                          {urlIsValid ? <br /> : <span>Ugyldig url</span>}
                        </div>
                        <div className={styles.iconField}>
                          <Icon
                            iconName={currentIcon}
                            className={styles.editIcon}
                          />
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
                          />
                        </div>
                        <div className={styles.editButtonsContainer}>
                          <PrimaryButton
                            disabled={
                              urlIsValid && titleHasContent ? false : true
                            }
                            onClick={() => {
                              // eslint-disable-next-line no-unused-expressions
                              o.add
                                ? // eslint-disable-next-line no-void
                                  void createItemInList()
                                : // eslint-disable-next-line no-void
                                  void saveItem(o.Id, index);
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
              <br />
              <div className={styles.deleteInfo}>{DeleteInfo}</div>
              {/*eslint-disable-next-line no-void*/}
              {showLagreSorteringsButton ? (
                <DefaultButton
                  onClick={() => {
                    void saveMultipleListItems(myLinksItems);
                    setShowLagreSorteringsButton(false);
                  }}
                >
                  Lagre ny sortering
                </DefaultButton>
              ) : (
                ""
              )}
            </div>
          </Modal>
        </>
      ) : (
        ""
      )}
      {/* Adminlinks */}
      {props.listGuid &&
      props.listGuid2 &&
      myAdminLinksItems.every((item) => item.Valgfri !== true) ? (
        <div className={styles.linkHeader}>
          {props.listTitleAdminlinks}{" "}
          <Icon
            style={{ cursor: "pointer" }}
            onClick={() => setshowFelleslenker(!showFelleslenker)}
            iconName={showFelleslenker ? "ChevronUp" : "ChevronDown"}
          />
        </div>
      ) : (
        ""
      )}

      {props.listGuid && props.listGuid2 ? (
        showFelleslenker ? (
          <>
            {myAdminLinksItems
              .filter((item) => {
                if (item.Valgfri == false) {
                  return { item };
                }
              })
              .map((o: IMYADMINLINKS, index: number) => {
                return (
                  <div key={index} className={styles.links}>
                    <Icon iconName="Link" />
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
              })}
          </>
        ) : (
          ""
        )
      ) : (
        ""
      )}
      {/* My links */}
      {props.listGuid && props.listGuid2 ? (
        <div className={styles.linkHeader}>
          {props.listTitleMylinks}{" "}
          <Icon
            style={{ cursor: "pointer" }}
            onClick={() => setshowEgendefinerte(!showEgendefinerte)}
            iconName={showEgendefinerte ? "ChevronUp" : "ChevronDown"}
          />
        </div>
      ) : (
        ""
      )}
      {props.listGuid && props.listGuid2 ? (
        <>
          {showEgendefinerte ? (
            <>
              {myLinksItems.map((o: IMYLINKS, index: number) => {
                return (
                  <div key={index} className={styles.links}>
                    <Icon
                      iconName={o.Icon}
                      className={styles.webpartLinkIcon}
                    />
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
              })}
            </>
          ) : (
            ""
          )}

          <br />
          <ActionButton
            className={`${styles.button} ms-fontColor-black`}
            shape="rounded"
            iconProps={addEdit2Icon}
            onClick={() => {
              showModal();
              setDeleteInfo("");
              setNewLinkFromList(false);
              setShowLagreSorteringsButton(false);
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
