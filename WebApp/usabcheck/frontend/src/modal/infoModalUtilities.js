import React from 'react';
import ModalContainer from "components/modalContainer.component";

export function CreateInfoModals(nameFormPair) {
  var infoRefPair = {};
  var modalList = [];

  for (var key in nameFormPair) {
    var infoRef = React.createRef();
    var objectKey = new Date().getTime() + key;
    var infoModal = 
      <ModalContainer 
        key={objectKey}
        Form={nameFormPair[key]} 
        ref={infoRef} 
        buttonClassName="invisible" 
        triggerText={""} 
        onSubmit={null}
      />  

    modalList.push(infoModal);
    infoRefPair[key] = infoRef;
  }

  return {infoRefPair:infoRefPair, modalList:modalList};
};

export function CreateInfoButton(modalName, showInfoModal) {
  return (
    <button type="button" style={{backgroundColor: "transparent"}}>
      <img 
        onClick={showInfoModal.bind(this, modalName)}
        src={`${process.env.PUBLIC_URL}/infoIcon.png`} 
        alt="Information Icon" 
        className="infoButton"
      />
    </button>
  );
}
