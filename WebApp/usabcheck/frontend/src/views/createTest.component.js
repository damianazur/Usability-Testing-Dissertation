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

      pretestKeyIndex: 0,
      testKeyIndex: 0,

      pretestRefs: [],
      testRefs: [],
    };
  }

  update() {
    console.log("CreateTest rerender update");
    this.setState();
  }

  deleteSequenceItem(sequenceKey, sequenceListName, refListName) {
    let sequenceList = this.state[sequenceListName];
    let refList = this.state[refListName];

    sequenceList = sequenceList.filter((item) => item.key !== sequenceKey.toString());
    refList = refList.filter((item) => item.key !== sequenceKey);

    this.setState({
      [sequenceListName]: sequenceList,
      [refListName]: refList
    });
  }

  appendSequenceItem(sequenceListName, keyName, itemName, refListName) {
    let sequenceList = this.state[sequenceListName];
    let key = this.state[keyName];

    const DynamicItem = this.components[itemName];

    let ref = React.createRef();
    let refContainer = {
      key: key,
      ref: ref
    }
    let refs = this.state[refListName];
    refs.push(refContainer);

    sequenceList.push(
      <div key={key} style={{marginBottom: "5px"}}>
        <DynamicItem 
          ref={ref} 
          sequenceKey={key} 
          sequenceListName={sequenceListName} 
          onDelete={this.deleteSequenceItem.bind(this)}
          refListName={refListName}
          updateParent={this.update.bind(this)}
          >
        </DynamicItem>
      </div>
    );

    this.setState({
      [sequenceListName]: sequenceList, 
      [keyName]: key+1,
      [refListName]: refs
    });
  }
  
  renderLoadingState = () => (
    <div className="post-loading">
      Loading...
    </div>
  )

  onProjectCreate(e) {
    e.preventDefault();
    console.log("CREATE TEST ", e);

    let testSequenceData = [];
    let refs = this.state.testRefs;

    console.log("REFS", refs);

    for(let i = 0; i < refs.length; i++) {
      let componentRef = this.state.testRefs[i].ref;
      let componentData = componentRef.current.state;
      let outputData = componentData.outputData;
      
      let item = {
        data: outputData,
        sequenceNumber: i
      };

      testSequenceData.push(item);
    }

    console.log(testSequenceData);
  }

  render() {  
    console.log("RENDER", this.state.testRefs);
    console.log("SEQUENCE", this.state.testSequenceList);    
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
              <button type="button" onClick={this.appendSequenceItem.bind(this, "testSequenceList", "testKeyIndex", "TaskCreateBox", "testRefs")} className="secondaryButton">
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