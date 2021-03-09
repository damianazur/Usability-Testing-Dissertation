import React, { Component } from "react";
import Server from "services/server.service";
import TaskCreateBox from "components/taskCreate.component";
import TextQuestionCreateBox from "components/textQuestionCreate.component";
import MutlipleChoiceQuestionBox from "components/mutliplechoiceQuestion.component";
import DropdownGenerator from "components/dropdownGenerator.component";
import { createNotification } from 'utilities/utils.js';

import 'react-notifications/lib/notifications.css';
import "bootstrap.min.css";

export default class CreateTest extends Component {
  constructor(props) {
    super(props);

    this.components = {
      "TaskCreateBox": TaskCreateBox,
      "TextQuestionCreateBox": TextQuestionCreateBox,
      "MutlipleChoiceQuestionBox": MutlipleChoiceQuestionBox
    };

    console.log(this.props.location.state);

    this.state = {
      pretestSequenceList: [],
      testSequenceList: [],

      pretestKeyIndex: 0,
      testKeyIndex: 0,

      pretestRefs: [],
      testRefs: [],

      projects: [],
      projectDropdown: [],
      selectedProject: {
        projectName: this.props.location.state.projectName,
        projectId: this.props.location.state.projectId
      },
    };
  }

  componentDidMount() {
    this.updateProjectList();
  }

  updateProjectList() {
    Server.getProjectList().then(response => {
      this.setState({projects: response.data}, () => {
        this.generateProjectDropdown(this.onProjectSelect.bind(this));
      });
    });
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
          <button type="button" style={{backgroundColor: "transparent", position: "relative", left: "calc(90% + 10px)", transform: "translate(0, 25px)"}}>
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
          <button type="button" style={{backgroundColor: "transparent", position: "relative", left: "calc(90% + 10px)", transform: "translate(0, 50px)"}}>
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
    console.log("CREATE TEST ", e.target.testName.value);

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

    let sequenceNumber = 0;
    for (let stageIndex = 0; stageIndex < stages.length; stageIndex++) {
      let refs = stages[stageIndex].refs;

      for(let i = 0; i < refs.length; i++) {
        let componentRef = refs[i].ref;
        let componentData = componentRef.current.state;
        let outputData = componentData.outputData;
        
        let item = {
          data: outputData,
          stage: stages[stageIndex].stage,
          indexNumber: sequenceNumber,
          type: outputData.type
        };

        testSequenceData.push(item);
        sequenceNumber += 1;
      }
    }

    let uploadData = {
      testName: testName,
      projectId: this.state.selectedProject.projectId,
      sequenceData: testSequenceData
    };


    console.log(uploadData);
    Server.createTest(uploadData).then(
      () => {
        createNotification('success', "Test Created Successfully!");
        this.props.history.push("/dashboard");
        // window.location.reload();
      },
      error => {
        const resMessage = (
          error.response &&
          error.response.data &&
          error.response.data.message) || 
          error.message ||
          error.toString();
        
        console.log(error.message);

        createNotification("error", error.toString());

        this.setState({
          loading: false,
          message: resMessage
        });
      }
    );
  }

  // createNotification(type, message) {
  //   switch (type) {
  //     case 'info':
  //       alert = NotificationManager.info(message, 'Info', 3000);
  //       break;
  //     case 'success':
  //       alert = NotificationManager.success(message, 'Success', 3000);
  //       break;
  //     case 'warning':
  //       alert = NotificationManager.warning(message, 'Warning', 3000);
  //       break;
  //     case 'error':
  //       alert = NotificationManager.error(message, 'Error', 5000, () => {
  //         console.log("Error callback");
  //       });
  //       break;
  //   }

    // return (
    //   {alert}
    // );
  // };

  onProjectSelect(params) {
    params = JSON.parse(params);
    let projectName = params.projectName;

    console.log("Selected project: ", params)

    this.setState({selectedProject: {
      projectName: projectName,
      projectId: params.projectId
    }});
  }

  generateProjectDropdown(onSelectFunction) {
    let projects = this.state.projects;
    let menuItems = [];

    for(let i = 0; i < projects.length; i++) {
      let project = projects[i];
      let item = {};

      item.name = project.projectName;
      item.params = {
        projectName: project.projectName,
        projectId: project.projectId
      };
      item.onSelectFunction = onSelectFunction;

      menuItems.push(item);
    }

    var projectDropdown = <DropdownGenerator data={menuItems} initalText={this.state.selectedProject.projectName}></DropdownGenerator>;
    this.setState({projectDropdown: projectDropdown});
  }

  render() {  
    // console.log("RENDER", this.state.testRefs);
    // console.log("SEQUENCE", this.state.testSequenceList);    
    return (
      <div className="mainPageDiv">
        {/* <div>
          <button className='btn btn-info'
            onClick={createNotification.bind(this, 'success', "Test Created Successfully!")}>Info
          </button>
        </div> */}

        <h1>Create Usability Test</h1>
        <hr></hr>

        <div className="createTest-content">  
          <form onSubmit={this.onProjectCreate.bind(this)}>
            <label style={{marginRight: "15px"}}>Project</label>
            {this.state.projectDropdown}
            <br></br>
            <label>Test Name</label>
            <input placeholder="Test Name" autoComplete="off" className="inputField2" type="text" name="testName" required/>
            
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