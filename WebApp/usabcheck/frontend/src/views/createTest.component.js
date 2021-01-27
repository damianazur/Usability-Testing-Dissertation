import React, { Component } from "react";
import Server from "services/server.service";
import TaskCreateBox from "components/taskCreate.component";
import TextQuestionCreateBox from "components/textQuestionCreate.component";
import MutlipleChoiceQuestionBox from "components/mutliplechoiceQuestion.component";

import "bootstrap.min.css";

export default class CreateTest extends Component {
  constructor(props) {
    super(props);

    this.components = {
      "TaskCreateBox": TaskCreateBox,
      "TextQuestionCreateBox": TextQuestionCreateBox,
      "MutlipleChoiceQuestionBox": MutlipleChoiceQuestionBox
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

    console.log(typeof sequenceKey, typeof sequenceList[0].key, typeof refList[0].key);

    sequenceList = sequenceList.filter((item) => parseInt(item.key) !== sequenceKey);
    refList = refList.filter((item) => item.key !== sequenceKey);

    this.setState({
      [sequenceListName]: sequenceList,
      [refListName]: refList
    });
  }

  shiftItem(sequenceListName, refListName, key, direction) {
    let directionMap = {
      "DOWN": 1,
      "UP": -1
    };
    let lists = [sequenceListName, refListName];

    for (let i = 0; i < lists.length; i++) {
      let listName = lists[i];

      let list = this.state[listName];
      let itemIndex = list.findIndex((item) => parseInt(item.key) === key);

      if (direction === "DOWN" && itemIndex === list.length -1) {
        return;
      }
      if (direction === "UP" && itemIndex === 0) {
        return;
      }

      let current = list[itemIndex];
      let next = list[itemIndex + directionMap[direction]];
      list[itemIndex + directionMap[direction]] = current;
      list[itemIndex] = next;

      this.setState({
        [listName]: list
      });
    }
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
        <div style={{height: "0"}}>
          <button style={{backgroundColor: "transparent", position: "relative", left: "calc(90% + 10px)", transform: "translate(0, 25px)"}}>
            <img 
              onClick={this.shiftItem.bind(this, sequenceListName, refListName, key, "UP")}
              src={`${process.env.PUBLIC_URL}/UpArrow.png`} 
              alt="downdown down arrow icon" 
              style={{
                width: "30px", 
                height: "15px"
              }}
            />
          </button>
        </div>
        <div style={{height: "0"}}>
          <button style={{backgroundColor: "transparent", position: "relative", left: "calc(90% + 10px)", transform: "translate(0, 50px)"}}>
            <img 
              onClick={this.shiftItem.bind(this, sequenceListName, refListName, key, "DOWN")}
              src={`${process.env.PUBLIC_URL}/DownArrow.png`} 
              alt="downdown down arrow icon" 
              style={{
                width: "30px", 
                height: "15px"
              }}
            />
          </button>
        </div>

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
    // console.log("CREATE TEST ", e.target.testName.value);

    let testName = e.target.testName.value;
    let testSequenceData = [];

    let stages = [
      {
        stage: "pre-test",
        refs: this.state.pretestRefs
      },
      {
        stage: "test",
        refs: this.state.testRefs
      }
    ];

    for (let stageIndex = 0; stageIndex < stages.length; stageIndex++) {
      let refs = stages[stageIndex].refs;

      for(let i = 0; i < refs.length; i++) {
        let componentRef = refs[i].ref;
        let componentData = componentRef.current.state;
        let outputData = componentData.outputData;
        
        let item = {
          data: outputData,
          stage: stages[stageIndex].stage,
          indexNumber: i,
          type: outputData.type
        };

        testSequenceData.push(item);
      }
    }

    let uploadData = {
      testName: testName,
      projectId: this.props.location.state.projectId,
      sequenceData: testSequenceData
    };


    console.log(uploadData);
    Server.createTest(uploadData);
  }

  render() {  
    // console.log("RENDER", this.state.testRefs);
    // console.log("SEQUENCE", this.state.testSequenceList);    
    return (
      <div className="mainPageDiv">
        <h1>Create Usability Test</h1>
        <hr></hr>

        <div className="createTest-content">  
          <form onSubmit={this.onProjectCreate.bind(this)}>
            <label>Test Name</label>
            <input placeholder="Test Name" autoComplete="off" className="inputField2" type="text" name="testName"/>
            
            {/* --------- PRE-TEST QUESTIONS --------- */}
            <h2 style={{marginTop: "50px"}}>Pre-test Questions</h2>
            <div id="preTestInstructionHolder">
              {this.state.pretestSequenceList}
            </div>
            <div style={{marginTop: "10px"}}>
              <button 
                type="button" 
                onClick={this.appendSequenceItem.bind(
                  this, "pretestSequenceList", "pretestKeyIndex", "TextQuestionCreateBox", "pretestRefs")}
                className="secondaryButton">
                + Text Question
              </button>
              <button 
                type="button" 
                onClick={this.appendSequenceItem.bind(
                  this, "pretestSequenceList", "pretestKeyIndex", "MutlipleChoiceQuestionBox", "pretestRefs")}
                className="secondaryButton">
                + Multiple Choice Question
              </button>
            </div>
            
            <hr></hr>

            {/* --------- USABILITY TEST BODY (TASKS & QUESTIONS) --------- */}
            <h2  style={{marginTop: "50px"}}>Usability Test</h2>
            <div id="testInstructionHolder">
              {this.state.testSequenceList}
            </div>

            <div style={{marginTop: "10px"}}>
              <button 
                type="button" 
                onClick={this.appendSequenceItem.bind(
                  this, "testSequenceList", "testKeyIndex", "TaskCreateBox", "testRefs")}
                className="secondaryButton">
                + Task
              </button>

              <button type="button" 
                onClick={this.appendSequenceItem.bind(
                  this, "testSequenceList", "testKeyIndex", "TextQuestionCreateBox", "testRefs")}
                className="secondaryButton">
                + Question (Text)
              </button>

              <button type="button" 
                onClick={this.appendSequenceItem.bind(
                  this, "testSequenceList", "testKeyIndex", "MutlipleChoiceQuestionBox", "testRefs")}
                className="secondaryButton">
                + Question (Multiple Choice)
              </button>
            </div>

            <div>
              <button className="primaryButton" style={{"backgroundColor": "#00b500"}}>
                Create Test
              </button>
            </div>
          </form>
        </div>
      </div>
    )
  }
}