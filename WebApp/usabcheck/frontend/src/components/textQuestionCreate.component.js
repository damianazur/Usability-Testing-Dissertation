import React, { Component } from 'react';
import DropdownGenerator from "components/dropdownGenerator.component";

export class TestQuestionBox extends Component {
  constructor(props) {
    super(props);

    this._questionRef = React.createRef();

    this.state = {
      type: "task",
      outputData: {}
    };
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

  render() {
    // console.log("Task Create Output", this.state.outputData);

    return (
      <div className="createTestInputBox textQuestionCreate">
        <h3 className="createTestInputBox-heading">Question (Text Answer)</h3>      
        {this.generateOptionsDropdown()}

        <hr className="createTestInputBox-hr"></hr>
        <div>
          <input 
            ref={this._questionRef}
            onChange={this.updateOutputData.bind(this)} 
            placeholder="Question" 
            autoComplete="off" 
            className="inputField" 
            type="text"
          />
        </div>
      </div>
    )
  }
}

export default TestQuestionBox;
