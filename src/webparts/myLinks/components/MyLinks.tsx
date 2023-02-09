import * as React from 'react';
import styles from './MyLinks.module.scss';
import { IMyLinksProps } from './IMyLinksProps';
import { escape } from '@microsoft/sp-lodash-subset';
import { SPFI } from '@pnp/sp';
import { useEffect, useState} from 'react';
import { IMYLINKS, IMYADMINLINKS } from '../../../interfaces'; 
import { getSP } from '../../../pnpjsConfig';
import { Icon, IIconProps } from '@fluentui/react';
import { Placeholder } from "@pnp/spfx-controls-react/lib/Placeholder";
import { WebPartTitle } from "@pnp/spfx-controls-react/lib/WebPartTitle";
import { ActionButton } from 'office-ui-fabric-react/lib/Button';
import { MYModal } from './MyLinksModal';

import { DefaultButton, IconButton } from "@fluentui/react/lib/Button";
import { useId, useBoolean } from "@fluentui/react-hooks";
import { Modal } from 'office-ui-fabric-react';
import { Item } from '@pnp/sp/items';

const addLinkIcon: IIconProps = { iconName: 'AddLink' };
const addEditIcon: IIconProps = { iconName: 'Edit' };
const addDeleteIcon: IIconProps = { iconName: 'Delete' };
const cancel: IIconProps = { iconName: 'Cancel' };



const MyLinks = (props:IMyLinksProps) =>{

  const [DeleteInfo, setDeleteInfo] = useState([]);

  function getEditItem(id:number){
    // let modalItemsList = _sp.web.lists.getById(props.listGuid);
    // let item = modalItemsList.items.getById(id)()
    console.log(id)
  }

  function deleteItem(id:number, title:string): void{
    // let modalItemsList = _sp.web.lists.getById(props.listGuid);
    // let item = modalItemsList.items.getById(id)()
    const list = _sp.web.lists.getById(props.listGuid)
    // list.items.getById(id).delete();
    // alert(title + "is deleted");
    console.log(myLinksItems)
    {myLinksItems.map(item => (
          setMyLinksItems(
            myLinksItems.filter(a =>
              a.Id !== id
            )
          )
        ))}
      let deleteInfoTXT = "Du har slettet: " + title
      setDeleteInfo([deleteInfoTXT]);
  }

       
     
    
  

  const LOG_SOURCE = 'MyLinks Webpart';
  const LIST_NAME = 'mylinks';

  let _sp:SPFI = getSP(props.context);

  //Mylinks Items
  const [myLinksItems,setMyLinksItems] = useState<IMYLINKS[]>([])

  const getMyLinksItems = async () => {
    
    console.log('context',_sp);
    const items = _sp.web.lists.getById(props.listGuid).items.select().orderBy('Title',true)();

    console.log('mylinks Items',items);

    setMyLinksItems((await items).map((item:any) => {
      return{
        Id: item.ID,
        Title: item.Title,
        Icon: item.Icon,
        Link: item.Link.Url,
        openinnewtab: item.openinnewtab 
      }
    }))

  }

  //Myadminlinks items
  const [myAdminLinksItems,setMyAdminLinksItems] = useState<IMYADMINLINKS[]>([])

  const getMyAdminLinksItems = async () => {
    
    console.log('context',_sp);
    const items = _sp.web.lists.getById(props.listGuid2).items.select().orderBy('Title',true)();

    console.log('mylinksAdmin Items',items);

    setMyAdminLinksItems((await items).map((item:any) => {
      return{
        Id: item.ID,
        Title: item.Title,
        Link: item.Link.Url,
        openinnewtab: item.openinnewtab 
      }
    }))

  }

  //

  const [isModalOpen, { setTrue: showModal, setFalse: hideModal }] = useBoolean(
    false
  );

  const titleId = useId("title");

  useEffect(() => {
    if(props.listGuid && props.listGuid != ''){
    getMyLinksItems();
  }
  },[props])

  useEffect(() => {
    if(props.listGuid2 && props.listGuid2 != ''){
    getMyAdminLinksItems();
  }
  },[props])

  return(
    
    // <>
    // <h1>Hello World</h1>
    // <pre>{JSON.stringify(myLinksItems,null,2)}</pre>
    // </>
    <>
    {props.listGuid && props.listGuid2 ?
    <>
       <WebPartTitle displayMode={props.displayMode}
              title={props.title}
              updateProperty={props.updateProperty} />
              <ActionButton className={`${styles.button} ms-fontColor-black`} shape='rounded' iconProps={addEditIcon} onClick={()=> {showModal(); setDeleteInfo([""])}}>Rediger lenker</ActionButton>
              <br /><strong>Adminlinks</strong>
               <Modal
        titleAriaId={titleId}
        isOpen={isModalOpen}
        onDismiss={hideModal}
        isBlocking={false}
        forceFocusInsideTrap={false}
        containerClassName={'x'}
      > 
      <IconButton iconProps={cancel} onClick={hideModal}></IconButton>
      <div className={styles.modalWrapper}>
      <h3>Rediger mine lenker</h3>
      <ActionButton iconProps={addLinkIcon}>Ny lenke</ActionButton>
        {myLinksItems.map((o:IMYLINKS,index:number) =>{
      return (
        <div key={index}>
          <Icon iconName={o.Icon}></Icon>
          <span className={styles.modalLinkTitle}>{o.Title}</span>
          <IconButton iconProps={addEditIcon} onClick={() => getEditItem(o.Id)}></IconButton>
          <IconButton iconProps={addDeleteIcon} onClick={() => deleteItem(o.Id, o.Title)}></IconButton>
        </div> 
      )
    })}
      <span className={styles.deleteInfo}>{DeleteInfo}</span>
      </div>
        </Modal>
              
          
    </>
     : ""}
     {/* Adminlinks */}
     {props.listGuid && props.listGuid2 ? myAdminLinksItems.map((o:IMYADMINLINKS,index:number) =>{
      return (
        <div key={index}>
          <Icon iconName="Link"></Icon>
          {o.openinnewtab ? <> <a href={o.Link} rel="noreferrer" target="_blank">{o.Title}</a></>: <> <a href={o.Link} rel="noreferrer" target="_self">{o.Title}</a></> }
        </div> 
      )
     }): ""}
     {/* My links */}
    {props.listGuid && props.listGuid2 ? <strong>Egendefinerte lenker</strong> : ""}
    {props.listGuid && props.listGuid2 ? myLinksItems.map((o:IMYLINKS,index:number) =>{
      return (
        <div key={index}>
          <Icon iconName={o.Icon}></Icon>
          {o.openinnewtab ? <> <a href={o.Link} rel="noreferrer" target="_blank">{o.Title}</a></>: <> <a href={o.Link} rel="noreferrer" target="_self">{o.Title}</a></> }
        </div> 
      )
    }) :
    <Placeholder iconName='Edit'
         iconText='Configure your web part'
         description='Please configure the web part.'
         buttonLabel='Configure'
        onConfigure={() => props.context.propertyPane.open()}
        //  theme={this.props.themeVariant} 
        />}
    </>
  )
  
}

export default MyLinks
