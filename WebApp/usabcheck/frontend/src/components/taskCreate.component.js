import React, { Component } from 'react';
import DropdownGenerator from "components/dropdownGenerator.component";

export class TaskCreateBox extends Component {
  constructor(props) {
    super(props);

    this.state = {
      itemList: [],
      refs: [],
      key: 0,
      inputValues: {}
    };
  }

  async componentDidMount() {
    this.appendItem();
  }

  deleteItem(e) {
    let key = e.target.value;
    let itemList = this.state.itemList;

    itemList = itemList.filter((item) => item.key !== key);

    let inputValues = this.state.inputValues;
    delete inputValues[key]; 
    
    this.setState({itemList: itemList, inputValues: inputValues});
  }

  boxCurrentComponent() {
    this.props.onDelete(this.props.sequenceKey, this.props.sequenceListName);
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

  updateInputValue(evt, key) {
    let currentText = evt.target.value;
    let inputValues = this.state.inputValues;
    inputValues[key] = currentText
    this.setState({
      inputValues: inputValues
    });
  }

  appendItem() {
    let key = this.state.key;
    let itemList = this.state.itemList;

    let ref = React.createRef();
    let refContainer = {
      key: key,
      ref: ref
    }

    let refs = this.state.refs;
    refs.push(refContainer);
    this.setState({refs: refs});
    
    itemList.push(
      <div key={key} style={{marginBottom: "5px"}}>
        <div style={{"width": "90%", display:"inline-block"}}>
          <input 
            value={this.state.inputValue} 
            onChange={evt => this.updateInputValue(evt, key)} 
            ref={ref} 
            placeholder="Enter Instruction" 
            autoComplete="off" 
            className="inputField" 
            type="text"/>

        </div>
        <div style={{"width": "10%", display:"inline-block"}}>
          <button onClick={this.deleteItem.bind(this)} value={key} type="button" style={{"marginLeft": "25px", "backgroundColor":"red", "padding":"5px 10px 5px"}} className="secondaryButton">✖</button>
        </div>
      </div>
    );

    this.setState({itemList: itemList, key: key+1});

    console.log(this.state.itemList);
  }

  render() {
    console.log("Task Create: Inputs", this.state.inputValues);

    return (
      <div className="createTestInputBox">
        <h3 style={{margin: "0px", marginRight: "20px", display: "inline-block"}}>Task</h3>
        {this.generateOptionsDropdown()}
        <hr style={{borderColor: "white", margin: "10px 0 10px"}}></hr>
        <div>
          {this.state.itemList}
        </div>
        
        <div>
          <button type="button" onClick={this.appendItem.bind(this)} className="secondaryButton">
            Add Instruction
          </button>
        </div>
      </div>
    )
  }
}

export default TaskCreateBox;
