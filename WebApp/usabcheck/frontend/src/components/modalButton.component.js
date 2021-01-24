import React from 'react';
const ModalButton = ({ triggerText, buttonRef, showModal, buttonClassName }) => {
  console.log("buttonStyle", buttonClassName)

  return (
    <button
      className={buttonClassName}
      ref={buttonRef}
      onClick={showModal}
    >
      {triggerText}
    </button>
  );
};
export default ModalButton;
