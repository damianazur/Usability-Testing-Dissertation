import React, { Component } from 'react';
import DropdownGenerator from "components/dropdownGenerator.component";
import DynamicItemList from "components/dynamicList.component";

export class MultipleChoiceQuestionBox extends Component {
  constructor(props) {
    super(props);

    this._questionRef = React.createRef();
    this.choiceRef = React.createRef();

    this.state = {
      type: "task",
      outputData: {}
    };
  }

  updateOutputData() {
    if (this.choiceRef === undefined || this.choiceRef.current === null) {
      return;
    }

    let outputData = {
      type: "question",
      questionType: "multiple-choice",
      questionText: this._questionRef.current.value,
      choices: []
    };

    let componentData = this.choiceRef.current.state;
    let dynamicInputs = componentData.dynamicInputs;

    if (dynamicInputs.length === 0) {
      outputData.steps = [];
    } else {

      for(let j = 0; j < dynamicInputs.length; j++) {
        let inputValue = dynamicInputs[j];

        outputData.choices.push({
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

  // createPositionBox

  render() {
    // console.log("Task Create Output", this.state.outputData);

    return (
      <div className="createTestInputBox multipleChoiceCreate">
        <h3 className="createTestInputBox-heading">Question (Multiple Choice)</h3>  
        {this.generateOptionsDropdown()}

        <hr className="createTestInputBox-hr"></hr>
        <input 
            ref={this._questionRef}
            onChange={this.updateOutputData.bind(this)} 
            placeholder="Question" 
            autoComplete="off" 
            className="inputField" 
            type="text"
        />

        <h4 className="createTestInputBox-heading" style={{marginTop: "20px"}}>Answer Choices</h4>  
        <div>
          <DynamicItemList inputPlaceHolder="Answer Choice" buttonLabel="Add Answer" onUpdate={this.updateOutputData.bind(this)} ref={this.choiceRef}></DynamicItemList>
        </div>
      </div>
    )
  }
}

export default MultipleChoiceQuestionBox;
