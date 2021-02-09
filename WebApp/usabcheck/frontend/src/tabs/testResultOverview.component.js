import React, { Component } from 'react';
import DropdownGenerator from "components/dropdownGenerator.component";
import Server from "services/server.service";

export class TestResultOverviewTab extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isShown: false,
      selectedTask: {
        taskName: "Choose Task",
        taskId: undefined
      },
      tasks: []
    };

    // this.updateTaskList(this.props.testId);
    // console.log("Props", this.props);
  }

  enable() {
    this.isShown = true;
  }

  async componentDidMount() {
    console.log("Props", this.props);
    this.updateTaskList(this.props.testId);
  }

  updateTaskList(testId) {
    Server.getTaskList(testId).then(response => {
      console.log(response.data);
      this.setState({tasks: response.data});
    });
  }

  onTaskSelect(params) {
    params = JSON.parse(params);
    let taskName = params.taskName;

    console.log("Selected task: ", params)

    this.updateTaskList(params.taskId);
    this.setState({
      selectedTask: {
        taskName: taskName,
        taskId: params.taskId}
      });
  }

  generateTaskDropdown = (onSelectFunction, selectedTaskState) => {
    let tasks = this.state.tasks;
    let menuItems = [];

    for(let i = 0; i < tasks.length; i++) {
      let task = tasks[i];
      let item = {};

      item.name = task.taskName;
      item.params = {
        taskName: task.taskName,
        taskId: task.taskId
      };
      item.onSelectFunction = onSelectFunction;

      menuItems.push(item);
    }

    return (
      <DropdownGenerator data={menuItems} initalText={selectedTaskState}></DropdownGenerator>
    )
  }

  render() {
    return (
      <React.Fragment>
        {this.state.isShown ? (
          <div>
            Overview content goes here
            {this.generateTaskDropdown(this.onTaskSelect.bind(this), this.state.selectedTask.taskName)}
          </div>
        ) : ( 
          null
        )}
      </React.Fragment>
    )
  }
}

export default TestResultOverviewTab;
