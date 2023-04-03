import { Modal } from "office-ui-fabric-react";
import * as React from "react";
import { useId, useBoolean } from '@fluentui/react-hooks';
import styles from './MyLinks.module.scss';

export const MYModal = () => {
    const [isModalOpen, { setTrue: showModal, setFalse: hideModal }] = useBoolean(false);
    const [isPopup, setisPopup] = React.useState(true);
    const titleId = useId('title');
    React.useEffect(() => {
        showModal();
    }, [isPopup]);
    function ExitHandler() {
      hideModal();
      setisPopup(current => !current)
    //   myprops.handler();
    }

return(
<Modal
 titleAriaId={"Tittel"}
 isOpen={isModalOpen}
 onDismiss={ExitHandler}
 isBlocking={true}
 containerClassName={"modalbox"} 
 />
)
}
