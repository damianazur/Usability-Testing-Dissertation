import React from 'react';
const ModalButton = ({ triggerText, buttonRef, showModal }) => {
  return (
    <button
      className="dropDownButton"
      ref={buttonRef}
      onClick={showModal}
    >
      {triggerText}
    </button>
  );
};
export default ModalButton;
