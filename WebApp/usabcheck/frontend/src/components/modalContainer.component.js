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

  onClickOutside = (event) => {
    if (this.modal && this.modal.contains(event.target)) return;
    this.closeModal();
  };

  render() {
    return (
      <React.Fragment>
        {!this.props.disableButton ? (
          <ModalButton
            showModal={this.showModal}
            buttonRef={(n) => (this.ModalButton = n)}
            triggerText={this.props.triggerText}
            buttonClassName={this.props.buttonClassName}
          />
        ) : null}

        {this.state.isShown ? (
          <Modal
            onSubmit={this.props.onSubmit}
            modalRef={(n) => (this.modal = n)}
            buttonRef={(n) => (this.closeButton = n)}
            closeModal={this.closeModal}
            onKeyDown={this.onKeyDown}
            onClickOutside={this.onClickOutside}
            Form={this.props.Form}
            generateProjectDropdown={this.props.generateProjectDropdown}
            details={this.props.details}
          />
        ) : null}
      </React.Fragment>
    );
  }
}

export default ModalContainer;
