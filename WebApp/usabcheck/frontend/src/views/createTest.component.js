import React, { Component } from "react";
import Server from "services/server.service";
import TaskCreateBox from "components/taskCreate.component";

import "bootstrap.min.css";

export default class CreateTest extends Component {
  constructor(props) {
    super(props);

    this.components = {
      "TaskCreateBox": TaskCreateBox,
    };

    this.state = {
      pretestSequenceList: [],
      testSequenceList: [],
      preTestKeyIndex: 0,
      testKeyIndex: 0
    };
  }

  deleteSequenceItem(sequenceKey, sequenceListName) {
    let sequenceList = this.state[sequenceListName];

    sequenceList = sequenceList.filter((item) => item.key !== sequenceKey.toString());
    this.setState({[sequenceListName]: sequenceList});
  }

  appendSequenceItem(sequenceListName, keyName, itemName) {
    let sequenceList = this.state[sequenceListName];
    let key = this.state[keyName];

    const DynamicItem = this.components[itemName];

    sequenceList.push(
      <div key={key} style={{marginBottom: "5px"}}>
        <DynamicItem sequenceKey={key} sequenceListName={sequenceListName} onDelete={this.deleteSequenceItem.bind(this)}></DynamicItem>
      </div>
    );

    this.setState({[sequenceListName]: sequenceList, [keyName]: key+1});
  }
  
  renderLoadingState = () => (
    <div className="post-loading">
      Loading...
    </div>
  )

  onProjectCreate(e) {
    e.preventDefault();
    console.log("CREATE TEST ", e);
  }

  render() {  
    console.log("RENDER", this.state.testSequenceList);
    
    return (
      <div className="mainPageDiv">
        <h1>Create Usability Test</h1>
        <hr></hr>

        <div className="createTest-content">  
          <form onSubmit={this.onProjectCreate.bind(this)}>
            <label>Test Name</label>
            <input placeholder="Test Name" autoComplete="off" className="inputField2" id="projectName" type="text" name="projectName"/>
            
            <h2 style={{marginTop: "50px"}}>Pre-test Questions</h2>
            <div id="preTestInstructionHolder">
              {/* <TaskCreateBox></TaskCreateBox> */}
            </div>
            <div style={{marginTop: "10px"}}>
              <button className="secondaryButton">
                + Text Question
              </button>
              <button className="secondaryButton">
                + Multiple Choice Question
              </button>
            </div>

            <h2  style={{marginTop: "50px"}}>Usability Test</h2>
            <div id="testInstructionHolder">
              {this.state.testSequenceList}
              {/* <TaskCreateBox></TaskCreateBox> */}
            </div>

            <div style={{marginTop: "10px"}}>
              <button type="button" onClick={this.appendSequenceItem.bind(this, "testSequenceList", "testKeyIndex", "TaskCreateBox")} className="secondaryButton">
                + Task
              </button>
              <button className="secondaryButton">
                + Question (Text)
              </button>
              <button className="secondaryButton">
                + Question (Multiple Choice)
              </button>
            </div>

            <div>
              <button className="primaryButton" style={{"backgroundColor": "green"}}>
                Create Test
              </button>
            </div>
          </form>
        </div>
      </div>
    )
  }
}