import React, { Component } from 'react';
import DropdownGenerator from "components/dropdownGenerator.component";
import DynamicItemList from "components/dynamicList.component";

import { CreateInfoModals, CreateInfoButton } from 'modal/infoModalUtilities'; 
import { TaskInfoForm } from 'forms/infoForms';

export class TaskCreateBox extends Component {
  constructor(props) {
    super(props);

    this._instructionRef = React.createRef();
    this._taskNameRef = React.createRef();

    this.state = {
      type: "task",
      outputData: {},

      modalList: [],
      infoRefPair: {}
    };
  }

  componentDidMount() {
    this.setInfoModals();
  }

  updateOutputData() {
    if (this._instructionRef === undefined || this._instructionRef.current === null) {
      return;
    }

    let outputData = {
      type: "task",
      taskName: this._taskNameRef.current.value,
      steps: []
    };

    let componentData = this._instructionRef.current.state;
    let dynamicInputs = componentData.dynamicInputs;

    // console.log(dynamicInputs);

    if (dynamicInputs.length === 0) {
      outputData.steps = [];
    } else {

      for(let j = 0; j < dynamicInputs.length; j++) {
        let inputValue = dynamicInputs[j];

        outputData.steps.push({
          value: inputValue.value
        });
      }
    }

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
      "task": TaskInfoForm
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
    return (
      <div className="createTestInputBox taskCreate">
        <div>
          {this.state.modalList}
        </div>

        <h3 className="createTestInputBox-heading">Task</h3>
        <input className="createTestInputBox-inputField"
            ref={this._taskNameRef}
            onChange={this.updateOutputData.bind(this)} 
            placeholder="Task Name" 
            autoComplete="off"
            type="text"
            required/>
        
        {this.generateOptionsDropdown()}

        {CreateInfoButton("task", this.showInfoModal.bind(this))}

        <hr className="createTestInputBox-hr"></hr>
        <div>
          <DynamicItemList inputPlaceHolder="Enter Task Instruction" buttonLabel="Add Instruction" onUpdate={this.updateOutputData.bind(this)} ref={this._instructionRef}></DynamicItemList>
        </div>
      </div>
    )
  }
}

export default TaskCreateBox;
