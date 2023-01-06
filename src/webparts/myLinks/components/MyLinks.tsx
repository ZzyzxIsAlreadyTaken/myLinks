import * as React from 'react';
import styles from './MyLinks.module.scss';
import { IMyLinksProps } from './IMyLinksProps';
import { escape } from '@microsoft/sp-lodash-subset';
import { SPFI } from '@pnp/sp';
import { useEffect, useState} from 'react';
import { IMYLINKS } from '../../../interfaces'; 
import { getSP } from '../../../pnpjsConfig';
import { Icon, IIconProps } from '@fluentui/react';
import { Placeholder } from "@pnp/spfx-controls-react/lib/Placeholder";
import { WebPartTitle } from "@pnp/spfx-controls-react/lib/WebPartTitle";
import { ActionButton } from 'office-ui-fabric-react/lib/Button';
import { MYModal } from './MyLinksModal';

import { DefaultButton, IconButton } from "@fluentui/react/lib/Button";
import { useId, useBoolean } from "@fluentui/react-hooks";
import { Modal } from 'office-ui-fabric-react';

const addLinkIcon: IIconProps = { iconName: 'AddLink' };
const addEditIcon: IIconProps = { iconName: 'Edit' };
const addDeleteIcon: IIconProps = { iconName: 'Delete' };
const cancel: IIconProps = { iconName: 'Cancel' };


const MyLinks = (props:IMyLinksProps) =>{

  function editIcon(): void {
    alert('Hello');
    console.log('Hei');
  }

  const LOG_SOURCE = 'MyLinks Webpart';
  const LIST_NAME = 'mylinks';

  let _sp:SPFI = getSP(props.context);

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

  const [isModalOpen, { setTrue: showModal, setFalse: hideModal }] = useBoolean(
    false
  );

  const titleId = useId("title");

  useEffect(() => {
    if(props.listGuid && props.listGuid != ''){
    getMyLinksItems();
  }
  },[props])

  return(
    
    // <>
    // <h1>Hello World</h1>
    // <pre>{JSON.stringify(myLinksItems,null,2)}</pre>
    // </>
    <>
    {props.listGuid ?
    <>
       <WebPartTitle displayMode={props.displayMode}
              title={props.title}
              updateProperty={props.updateProperty} />
              <ActionButton className={`${styles.button} ms-fontColor-black`} shape='rounded' iconProps={addEditIcon} onClick={showModal}>Rediger lenker</ActionButton>
               {/* <DefaultButton onClick={showModal} text="Open Modal" /> */}
               <Modal
        titleAriaId={titleId}
        isOpen={isModalOpen}
        onDismiss={hideModal}
        isBlocking={false}
        forceFocusInsideTrap={false}
        containerClassName={'x'}
      > 
      <IconButton iconProps={cancel} onClick={hideModal}></IconButton>
      <h3>Rediger mine lenker</h3>
      <ActionButton iconProps={addLinkIcon}>Ny lenke</ActionButton>
        {myLinksItems.map((o:IMYLINKS,index:number) =>{
      return (
        <div key={index}>
          <Icon iconName={o.Icon}></Icon>
          {o.Title}
          <IconButton iconProps={addEditIcon} onClick={editIcon}></IconButton>
          <IconButton iconProps={addDeleteIcon}></IconButton>
        </div> 
      )
    })}
        </Modal>
              
              {/* <h2>Lenke</h2> */}
    </>
     : ""}
    {props.listGuid ? myLinksItems.map((o:IMYLINKS,index:number) =>{
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
