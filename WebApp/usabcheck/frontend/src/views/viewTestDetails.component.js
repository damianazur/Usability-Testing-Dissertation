import React, { Component } from "react";
import Server from "services/server.service";

import "bootstrap.min.css";

export default class ViewTestDetails extends Component {
  constructor(props) {
    super(props);

    this.state = {
      testDetails: ""
    };
  }

  componentDidMount() {
    this.generateItems()
  }

  update() {
    console.log("CreateTest rerender update");
    this.setState();
  }

  generateItems() {
    let testId = this.props.location.state.testId;

    Server.getTestsWithDetails(testId).then(response => {
      console.log("Data Obectained")
      let data = response.data;
      console.log(data);

      let sequenceData = data.sequenceData.sort((a, b) => (a.sequenceNumber > b.sequenceNumber) ? 1 : -1)
      
      let key = 0;
      let preTestItems = [];
      let duringTestItems = [];
      let itemNameMap = {
        "pre-test" : preTestItems,
        "test" : duringTestItems
      }
      for (var i = 0; i < sequenceData.length; i++) {
        let seqItem = sequenceData[i];
        
        if (seqItem.questionId) {
          let stage = seqItem.stage;
          let questionConfigs = JSON.parse(seqItem.questionConfigsJSON);
          let questionType = questionConfigs.questionType;
          
          console.log(questionType);
          if (questionType === "text") {
            itemNameMap[stage].push(
              <div key={key} className="createTestInputBox textQuestionCreate">
                <h3 style={{marginTop: "0px"}}>Question (Text Answer)</h3>
                <hr className="createTestInputBox-hr"></hr>
                <label className="label-1">Question:</label>
                <span className="viewDetails-span">{questionConfigs.questionText}</span>
              </div>
            );
            key += 1;

          } else if (questionType === "multiple-choice") {
            let choicesList = [];
            for (let choiceKey = 0; choiceKey < questionConfigs.choices.length; choiceKey++) {
              let choice = questionConfigs.choices[choiceKey];
              choicesList.push(
                <div className="viewDetails-span" key={choiceKey}>{choice.value}</div>
              );
              key += 1;
            }

            itemNameMap[stage].push(
              <div key={key} className="createTestInputBox multipleChoiceCreate">
                <h3 style={{marginTop: "0px"}}>Question (Multiple Choice)</h3>
                <hr className="createTestInputBox-hr"></hr>
                <div>
                  <label className="label-1">Question:</label>
                  <span className="viewDetails-span">{questionConfigs.questionText}</span>
                </div>
                <div>
                  <label className="label-1">Choices:</label>
                </div>
                {choicesList}
              </div>
            );
            key += 1;
          }
          console.log(questionConfigs);
        }
        if (seqItem.taskId) {
          let taskSteps = JSON.parse(seqItem.stepsJSON);
          let instructionList = [];
          for (let instKey = 0; instKey < taskSteps.length; instKey++) {
            let task = taskSteps[instKey];
            instructionList.push(
              <div className="viewDetails-span" key={instKey}>{task.value}</div>
            );
          }

          console.log(seqItem);

          itemNameMap["test"].push(
            <div key={key} className="createTestInputBox taskCreate">
              <h3 style={{marginTop: "0px"}}>Task</h3>
              <hr className="createTestInputBox-hr"></hr>
              <div>
                <label className="label-1">Task Name:</label>
                <span className="viewDetails-span">{seqItem.taskName}</span>
              </div>
              <div>
                <label className="label-1">Instruction:</label>
              </div>
              {instructionList}
            </div>
          );
          key += 1;
        }

      }

      console.log(sequenceData);

      let items = [];
      items.push(
        <div key={key}>
          <h2>Usability Test Details</h2>
          <div>
            <label className="label-1">Test Name:</label>
            <span style={{fontWeight: "bold"}}>{data.testName}</span>
          </div>

          <div>
            <label className="label-1">Launched Date:</label>
            <span style={{fontWeight: "bold"}}>{data.launchedDate}</span>
          </div>

          <div>
            <label className="label-1">Status:</label>
            <span style={{fontWeight: "bold"}}>{data.testStatus}</span>
          </div>
          <hr></hr>
          <h2>Pre-test Questions</h2>
        </div>
      );
      key += 1;

      items.push(preTestItems);
      items.push(
        <div key={key}>
          <hr style={{marginTop: "80px"}}></hr>
          <h2>Usability Test</h2>
        </div>
      );
      items.push(duringTestItems);

      this.setState({testDetails: items});
    });
  }

  render() {  
    return (
      <div className="mainPageDiv">
        <h1>View Usability Test</h1>
        <hr></hr>
        <div className="createTest-content">  
          {this.state.testDetails}
        </div>
      </div>
    )
  }
}