import React, { Component } from 'react';
import Server from "services/server.service";

export class TaskGrading extends Component {
  constructor(props) {
    super(props);

    this.state = {
      gradeButtons: [],
      currentGrade: this.props.data.grade
    };
  }

  componentDidMount() {
    
  }

  setGrade(taskGradeId, grade) {
    // console.log(taskGradeId, grade);

    Server.updateTaskGrade(taskGradeId, grade).then(response => {
      // console.log(response.data);
      this.setState({
        taskGradeData: response.data}, () => {
          if (response.data == 1) {
            this.setState({currentGrade: grade});
          }
        });
    });
  }

  generateButtons() {
    // console.log(this.state.currentGrade);

    var buttons = [];

    var data = this.props.data;
    var currentGrade = this.state.currentGrade;
    var buttonDataList = [
      {
        buttonLabel: "Fail",
        style: {backgroundColor: "#FF5B5E", border: "1px solid red"}
      },
      {
        buttonLabel: "Pass",
        style: {backgroundColor: "#8BFF5E", border: "1px solid green"}
      },
      {
        buttonLabel: "Not Graded",
        style: {backgroundColor: "#779BFF", border: "1px solid blue"}
      }
    ];

    var key = 0;
    buttonDataList.forEach(buttonData => {
      var style = {};
      if (currentGrade == buttonData.buttonLabel) {
        style = buttonData.style;
      }
      buttons.push (
        <button key={key} onClick={this.setGrade.bind(this, data.taskGradeId, buttonData.buttonLabel)} className="gradingButtons" style={style}>
          {buttonData.buttonLabel}
        </button>
      )
      key += 1;
    });

    return buttons;
  }

  generateTaskText() {
    var data = this.props.data;
    // console.log(data);
    var stepsJSON = JSON.parse(data.stepsJSON);
    // console.log(stepsJSON);

    var taskStepsList = [];

    var key = 0;
    for (let i = 0; i < stepsJSON.length; i++) {
      taskStepsList.push(
        <label key={key} style={{display: "block", textAlign:"left", paddingLeft: "10px"}}>{stepsJSON[i]["value"]}</label>
      )
      key += 1;
    }
    // for (let i = 0; i < stepsJSON.length; i++) {
    //   taskStepsList.push(
    //     <label key={key} style={{display: "block", textAlign:"left", paddingLeft: "10px"}}>{stepsJSON[i]["value"]}</label>
    //   )
    //   key += 1;
    // }

    return taskStepsList;
  }

  render() {
    var data = this.props.data;
    // console.log(data);
  
    return (
      <div className="taskGradeBox">
        Task: <h4 style={{display: 'inline-block', margin: "0 0 20px"}}>{data.taskName}</h4>
        <div>
          <div readOnly style={{width: "95%", height: "100px", border: "1px solid gray", borderRadius: "3px", marginBottom: "15px", overflow: "auto"}}>
            {this.generateTaskText()}
          </div>
        </div>
        <div>
          {this.generateButtons()}
          {/* {this.state.gradeButtons} */}
        </div>
      </div>
    )
  }
}

export default TaskGrading;
