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
// import { Button} from '@fluentui/react-components';
import { ActionButton } from 'office-ui-fabric-react/lib/Button';

const addLinkIcon: IIconProps = { iconName: 'AddLink' };

const MyLinks = (props:IMyLinksProps) =>{

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
             
              <br />
              <ActionButton className='button' shape='rounded' iconProps={addLinkIcon}>Add link</ActionButton>
              <br />
    </>
     : ""}
    {props.listGuid ? myLinksItems.map((o:IMYLINKS,index:number) =>{
      return (
        <div key={index}>
          {o.Id} {o.Title} <Icon iconName={o.Icon}></Icon> {o.Link}
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
