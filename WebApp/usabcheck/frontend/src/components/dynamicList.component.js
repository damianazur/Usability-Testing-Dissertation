import React, { Component } from 'react';

export class DynamicList extends Component {
  constructor(props) {
    super(props);

    this.state = {
      itemList: [],
      nextKey: 0,
      dynamicInputs: []
    };
  }

  async componentDidMount() {
    this.appendItem();
  }

  deleteItem(e) {
    let key = e.target.value;
    let itemList = this.state.itemList;

    itemList = itemList.filter((item) => item.key.toString() !== key);

    let dynamicInputs = this.state.dynamicInputs;
    dynamicInputs = dynamicInputs.filter((item) => item.key.toString() !== key);

    this.setState({
      itemList: itemList, 
      dynamicInputs: dynamicInputs},
      this.props.onUpdate);

    // console.log(this.state.dynamicInputs);
  }

  updateInputValue(evt, key) {
    let currentText = evt.target.value;
    let dynamicInputs = this.state.dynamicInputs;
    
    let inputValueIndex = -1;
    // console.log(dynamicInputs);
    for (inputValueIndex = 0; inputValueIndex < dynamicInputs.length; inputValueIndex++) {
      if (dynamicInputs[inputValueIndex].key === key) {
        break;
      }
    }

    if (dynamicInputs[inputValueIndex]) {
      dynamicInputs[inputValueIndex].value = currentText;
    }

    this.setState({
      dynamicInputs: dynamicInputs}, 
      this.props.onUpdate
    );

    this.props.onUpdate();
  }

  appendItem() {
    let key = this.state.nextKey;
    let itemList = this.state.itemList;

    let dynamicInputs = this.state.dynamicInputs;
    dynamicInputs.push({
      key: key,
      value: "",
    });

    itemList.push(
      <div key={key}>
        <div style={{"width": "90%", display:"inline-block"}}>
          <input 
            onChange={evt => this.updateInputValue(evt, key)} 
            placeholder={this.props.inputPlaceHolder}
            autoComplete="off" 
            className="inputField" 
            type="text"/>

        </div>
        <div style={{"width": "10%", display:"inline-block"}}>
          <button onClick={this.deleteItem.bind(this)} value={key} type="button" style={{"marginLeft": "25px", "backgroundColor":"red", "padding":"5px 10px 5px"}} className="secondaryButton">✖</button>
        </div>
      </div>
    );

    this.setState({
      itemList: itemList, 
      nextKey: key+1, 
      dynamicInputs: dynamicInputs},
      this.props.onUpdate
    );
  }

  render() {
    // console.log("Dynamic Item List Inputs:");
    // console.log(this.state.dynamicInputs);

    return (
      <div>
        <div>
          {this.state.itemList}
        </div>
        <button type="button" onClick={this.appendItem.bind(this)} className="secondaryButton">
          {this.props.buttonLabel}
        </button>        
      </div>
    )
  }
}

export default DynamicList;
