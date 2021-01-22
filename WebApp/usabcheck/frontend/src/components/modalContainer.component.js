import React, { Component } from 'react';

import Modal from "modal/modalTemplate";
import ModalButton from "components/modalButton.component";

export class ModalContainer extends Component {
  state = { isShown: false };

  showModal = () => {
    this.setState({ isShown: true }, () => {
      this.closeButton.focus();
    });
  };

  closeModal = () => {
    this.setState({ isShown: false });
  };

  onSubmit = () => {
    console.log("Submitted!");
  };

  onClickOutside = (event) => {
    if (this.modal && this.modal.contains(event.target)) return;
    this.closeModal();
  };

  render() {
    return (
      <React.Fragment>
        <ModalButton
          showModal={this.showModal}
          buttonRef={(n) => (this.ModalButton = n)}
          triggerText={this.props.triggerText}
        />

        {this.state.isShown ? (
          <Modal
            onSubmit={this.props.onSubmit}
            modalRef={(n) => (this.modal = n)}
            buttonRef={(n) => (this.closeButton = n)}
            closeModal={this.closeModal}
            onKeyDown={this.onKeyDown}
            onClickOutside={this.onClickOutside}
          />
        ) : null}
      </React.Fragment>
    );
  }
}

export default ModalContainer;
