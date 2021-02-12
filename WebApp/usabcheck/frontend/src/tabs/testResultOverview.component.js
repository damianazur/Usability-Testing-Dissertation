import React, { Component } from 'react';
import DropdownGenerator from "components/dropdownGenerator.component";
import Server from "services/server.service";
import ApexCharts from 'apexcharts'
import Chart from "react-apexcharts";

export class TestResultOverviewTab extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isShown: true,
      taskGradeData: {},
      questionAnswerData: {},
      taskChartList: [],
      answerChartList: []
    };
  }

  async componentDidMount() {
    console.log("Props", this.props);
    this.updateTaskGrades(this.props.testId);
    this.updateQuestionAnswers(this.props.testId);
  }

  updateTaskGrades(testId) {
    Server.getTasksAndGrades(testId).then(response => {
      console.log(response.data);
      this.setState({
        taskGradeData: response.data}, () => {
          this.renderTaskCharts();
        });
    });
  }

  updateQuestionAnswers(testId) {
    Server.getQuestionAndAnswers(testId).then(response => {
      console.log(response.data);
      this.setState({
        questionAnswerData: response.data}, () => {
          this.renderAnswerCharts();
        });
    });
  }

  renderTaskCharts() {
    var colors = ['#55FF32', '#ff3232', '#B2B2B2'];
    var strokeColors = ['#4FE52D', '#E52D2D', '#999999'];

    var options = {
      chart: {
        height: 350,
        type: 'bar',
        events: {
          click: function(chart, w, e) {
            // console.log(chart, w, e)
          }
        },
      },
      colors: colors,
      plotOptions: {
        bar: {
          borderRadius: 6,
          columnWidth: '45%',
          distributed: true,
        }
      },
      dataLabels: {
        enabled: false
      },
      stroke: {
        show: true,
        width: 1,
        colors: strokeColors
      },
      legend: {
        show: false
      },
      xaxis: {
        categories: [
          ["Pass"],
          ["Fail"],
          ["Not Graded"], 
        ],
        labels: {
          style: {
            colors: '#000000',
            fontSize: '15px'
          }
        }
      },
      yaxis: {
        labels: {
          style: {
            colors: '#000000',
            fontSize: '15px'
          }
        }
      }
    }
  
    console.log(this.state.taskGradeData);

    var taskChartList = [];
    var tasks = this.state.taskGradeData["tasks"];
    var grades = this.state.taskGradeData["grades"];
    for (let i = 0; i < tasks.length; i++) {
      var task = tasks[i];

      var gradeCount = {
        "Pass": 0,
        "Fail": 0,
        "Not Graded": 0
      }

      for (let j = 0; j < grades.length; j++) {
        var grade = grades[j];
        if (grade["taskId"] === task["taskId"]) {
          var gradeName = grade["grade"];
          gradeCount[gradeName] += 1;
        }
      }
      var series = [{
        data: [gradeCount["Pass"], gradeCount["Fail"], gradeCount["Not Graded"]]
      }];

      taskChartList.push(
        <Chart
          options={options}
          series={series}
          type="bar"
          className="genericChart barChart"
        />
      );
    }

    this.setState({taskChartList: taskChartList});
  }

  getPieChartOptions() {
    var options = {
      chart: {
        type: 'pie',
      },
      plotOptions: {
        pie: {
          startAngle: 0,
          endAngle: 360,
          expandOnClick: true,
          offsetX: 0,
          offsetY: 70,
          customScale: 1.3,
          dataLabels: {
              offset: 40,
              minAngleToShowLabel: 10
          }, 
        },
      },
      dataLabels: {
        enabled: true,
        textAnchor: 'end',
        style: {
          fontSize: '12px',
          colors: ["#000000"],
          fontWeight: 'bold',
        },
        dropShadow: {
          enabled: false,
        },
      },
      legend: {
        fontSize: "15px",
        position: 'bottom',
        horizontalAlign: 'left',
      }
    };

    return options;
  }

  renderAnswerCharts() {
    var answerChartList = [];
    var questions = this.state.questionAnswerData["questions"];
    var answers = this.state.questionAnswerData["answers"];

    // Iterate over questions
    for (let i = 0; i < questions.length; i++) {
      var options = this.getPieChartOptions();
      // if (i == 2) {
      //   continue;
      // }

      var question = questions[i];
      var questionConfigsJSON = JSON.parse(question["questionConfigsJSON"]);
      
      // Show multiple choice questions
      if (questionConfigsJSON["questionType"] != "multiple-choice") {
        continue;
      }

      // Create a dictionary with all the answer options and their count
      var labelsAndCount = {};
      var choices = questionConfigsJSON["choices"];
      for (let n = 0; n < choices.length; n++) {
        let choice = choices[n]["value"];
        labelsAndCount[choice] = 0;
      }
      // Iterate over answers and if the questionId matches then increment the value of the answer
      for (let j = 0; j < answers.length; j++) {
        var answer = answers[j];
        if (answer["questionId"] === question["questionId"]) {
          var answer = JSON.parse(answer["answerJSON"])["answer"];
          labelsAndCount[answer] += 1;
        }
      }

      var series = [];
      var labels = [];
      Object.keys(labelsAndCount).forEach(function(key) {
        labels.push(key);
        series.push(labelsAndCount[key]);
      });
      options.labels = labels


      console.log("Creating Chart!", options, options.labels, series);

      var pieChart = 
      <Chart
        key={i}
        options={options}
        series={series}
        type="pie"
        className="genericChart pieChart"
      />
      answerChartList.push(
        pieChart
      );
      
      // answerChartList[answerChartList.length - 1].updateOptions(options);
      // answerChartList[answerChartList.length - 1].props.options.labels = labels;
      // console.log(answerChartList[answerChartList.length - 1]);
    }

    this.setState({answerChartList: answerChartList});
    
    // var series = [44, 55, 13, 43, 22];
    // let answerChartList = [];
    // var numCharts = 3
    // for (let i = 0; i < numCharts; i++) {
    //   answerChartList.push(
    //     <Chart
    //       options={options}
    //       series={series}
    //       type="pie"
    //       className="genericChart pieChart"
    //     />
    //   );
    // }

    // this.setState({answerChartList: answerChartList});
  }

  render() {
    return (
      <React.Fragment>
        {this.state.isShown ? (
          <div>
            <h2>Details</h2>
            <hr className="hr2"></hr>

            <h2>Overall Success Rate</h2>
            <hr className="hr2"></hr>

            <h2>Overall Task Performance</h2>
            <hr className="hr2"></hr>
            <div className="chartHolder">
              {this.state.taskChartList}
            </div>

            <h2>Overall Question Answers</h2>
            <hr className="hr2"></hr>
            <div className="chartHolder">
              {this.state.answerChartList}
            </div>

          </div>
        ) : ( 
          null
        )}
      </React.Fragment>
    )
  }
}

export default TestResultOverviewTab;
