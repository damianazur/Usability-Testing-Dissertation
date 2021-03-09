import React, { Component } from 'react';
import DropdownGenerator from "components/dropdownGenerator.component";

import { CreateInfoModals, CreateInfoButton } from 'modal/infoModalUtilities'; 
import { TextQuestionInfoForm } from 'forms/infoForms';

export class TestQuestionBox extends Component {
  constructor(props) {
    super(props);

    this._questionRef = React.createRef();

    this.state = {
      type: "task",
      outputData: {}
    };
  }

  componentDidMount() {
    this.setInfoModals();
  }

  updateOutputData() {
    let outputData = {
      type: "question",
      questionType: "text",
      questionText: this._questionRef.current.value
    };

    this.setState({outputData: outputData});
  }

  boxCurrentComponent() {
    this.props.onDelete(this.props.sequenceKey, this.props.sequenceListName, this.props.refListName);
  }

  generateOptionsDropdown = () => {
    let menuItems = [];

    let item = {};
    item.name = "Delete";
    item.params = {
    };
    item.onSelectFunction = this.boxCurrentComponent.bind(this);

    menuItems.push(item);

    return (
      <DropdownGenerator data={menuItems} initalText={"Options"}></DropdownGenerator>
    )
  }

  setInfoModals() {
    var nameFormPair = {
      "textQuestion": TextQuestionInfoForm
    }
    var returnData = CreateInfoModals(nameFormPair);
    this.setState({
      modalList: returnData.modalList, 
      infoRefPair: returnData.infoRefPair
    })
  }
  
  showInfoModal(modalName) {
    var ref = this.state.infoRefPair[modalName];
    ref.current.showModal();
  }

  render() {
    // console.log("Task Create Output", this.state.outputData);

    return (
      <div className="createTestInputBox textQuestionCreate">
        <div>
          {this.state.modalList}
        </div>
        
        <h3 className="createTestInputBox-heading">Question (Text Answer)</h3>     

        {this.generateOptionsDropdown()}

        {CreateInfoButton("textQuestion", this.showInfoModal.bind(this))}

        <hr className="createTestInputBox-hr"></hr>
        <div>
          <input 
            ref={this._questionRef}
            onChange={this.updateOutputData.bind(this)} 
            placeholder="Question" 
            autoComplete="off" 
            className="inputField" 
            type="text"
            required
          />
        </div>
      </div>
    )
  }
}

export default TestQuestionBox;
