import React, { Component } from 'react';
import DropdownGenerator from "components/dropdownGenerator.component";
import Server from "services/server.service";
import ApexCharts from 'apexcharts'

export class TestResultOverviewTab extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isShown: true,
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

  renderBarChart() {
    // var series = [{
    //   data: [21, 22, 10, 28, 16, 21, 13, 30]
    // }];

    // var options= {
    //   chart: {
    //     height: 350,
    //     type: 'bar',
    //     events: {
    //       click: function(chart, w, e) {
    //         // console.log(chart, w, e)
    //       }
    //     }
    //   },
    //   colors: colors,
    //   plotOptions: {
    //     bar: {
    //       borderRadius: 6,
    //       columnWidth: '45%',
    //       distributed: true,
    //     }
    //   },
    //   dataLabels: {
    //     enabled: false
    //   },
    //   legend: {
    //     show: false
    //   },
    //   xaxis: {
    //     categories: [
    //       ['John', 'Doe'],
    //       ['Joe', 'Smith'],
    //       ['Jake', 'Williams'],
    //       'Amber',
    //       ['Peter', 'Brown'],
    //       ['Mary', 'Evans'],
    //       ['David', 'Wilson'],
    //       ['Lily', 'Roberts'], 
    //     ],
    //     labels: {
    //       style: {
    //         colors: colors,
    //         fontSize: '12px'
    //       }
    //     }
    //   }
    // }

    // return (
    //   <div id="chart">
    //     <ApexCharts options={this.state.options} series={this.state.series} type="bar" height={350} />
    //   </div>
    // );
  }

  renderChart() {
    var options = {
      chart: {
        type: 'line'
      },
      series: [{
        name: 'sales',
        data: [30,40,35,50,49,60,70,91,125]
      }],
      xaxis: {
        categories: [1991,1992,1993,1994,1995,1996,1997,1998,1999]
      }
    }
    
    var chart = new ApexCharts(document.querySelector("#chartX2"), options);
    
    chart.render();
  }

  render() {
    return (
      <React.Fragment>
        {this.state.isShown ? (
          <div style={{display: "none"}}>
            Overview content goes here
            {this.generateTaskDropdown(this.onTaskSelect.bind(this), this.state.selectedTask.taskName)}
            <div id="chartX2">
            </div>
            {this.renderChart()}
          </div>
        ) : ( 
          null
        )}
      </React.Fragment>
    )
  }
}

export default TestResultOverviewTab;
