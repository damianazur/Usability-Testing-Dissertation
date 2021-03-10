import React, { Component } from 'react';
import Server from "services/server.service";
// import ApexCharts from 'apexcharts'
import Chart from "react-apexcharts";

export class TestResultOverviewTab extends Component {
  constructor(props) {
    super(props);

    this.state = {
      displayStatus: "none",

      taskGradeData: {},
      questionAnswerData: {},
      instanceData: [],

      taskChartList: [],
      overallChart: [],
      answerChartList: [],
      textAnswerList: [],
    };
  }

  async componentDidMount() {
    console.log("Props", this.props);
    this.updateInstanceData(this.props.testId);
    this.updateTaskGrades(this.props.testId);
    this.updateQuestionAnswers(this.props.testId);
  }

  componentDidUpdate() {
    console.log("Updated");
  }

  disable() {
    this.setState({displayStatus: "none"});
  }

  enable() {
    this.setState({displayStatus: ""}, () => {
      this.updateInstanceData(this.props.testId);
      this.updateTaskGrades(this.props.testId);
      this.updateQuestionAnswers(this.props.testId);
    });
  }


  updateTaskGrades(testId) {
    Server.getTasksAndGrades(testId).then(response => {
      // console.log(response.data);
      this.setState({
        taskGradeData: response.data}, () => {
          this.renderTaskCharts("chartPerTask", "taskChartList");
          this.renderTaskCharts("overall", "overallChart");
        });
    });
  }

  updateQuestionAnswers(testId) {
    Server.getQuestionAndAnswers(testId).then(response => {
      // console.log(response.data);
      this.setState({
        questionAnswerData: response.data}, () => {
          this.renderAnswerCharts();
        });
    });
  }

  updateInstanceData(testId) {
    Server.getTestInstances(testId).then(response => {
      // console.log(response.data);
      this.setState({
        instanceData: response.data}
      )
    });
  }

  getTaskSettings() {
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
            fontSize: '16px'
          }
        }
      },
      yaxis: {
        labels: {
          style: {
            colors: '#000000',
            fontSize: '16px'
          }
        }
      }
    }

    return options;
  }

  parseTaskGradeData() {
    var parsedChartData = {
      totalGradeCount: {},
      individualTaskCounts: []
    };
    var tasks = this.state.taskGradeData["tasks"];
    var grades = this.state.taskGradeData["grades"];
    var totalGradeCount = {
      "Pass": 0,
      "Fail": 0,
      "Not Graded": 0
    }

    for (let i = 0; i < tasks.length; i++) {
      var task = tasks[i];
      
      var individualTaskCount = {
        "Task": task,
        "Pass": 0,
        "Fail": 0,
        "Not Graded": 0
      }

      for (let j = 0; j < grades.length; j++) {
        var grade = grades[j];
        if (grade["taskId"] === task["taskId"]) {
          var gradeName = grade["grade"];
          individualTaskCount[gradeName] += 1;
          totalGradeCount[gradeName] += 1;
        }
      }

      parsedChartData["individualTaskCounts"].push(individualTaskCount);
    }

    parsedChartData["totalGradeCount"] = totalGradeCount

    return parsedChartData;
  }

  renderTaskCharts(type, listName) {
    var options = this.getTaskSettings()
    var parsedChartData = this.parseTaskGradeData();

    var taskChartList = [];    

    if (type == "chartPerTask") {
      var individualTaskCounts = parsedChartData["individualTaskCounts"]

      for (let i = 0; i < individualTaskCounts.length; i++) {
        var gradeCount = individualTaskCounts[i]

        // console.log(gradeCount);

        var series = [{
          data: [gradeCount["Pass"], gradeCount["Fail"], gradeCount["Not Graded"]]
        }];
        var key = new Date().getTime() + i.toString();
        taskChartList.push(
          <div key={key} style={{display: "inline-block", "marginRight": "30px"}}>
            <h3 className="chartHeading">
            [{gradeCount["Task"]["sequenceNumber"] + 1}] {gradeCount["Task"]["taskName"]}
            </h3>
            <Chart
              options={options}
              series={series}
              type="bar"
              className="genericChart barChart"
            />
          </div>
        );
      }

    } else if (type == "overall") {
      var totalCount = parsedChartData["totalGradeCount"]

      var series = [{
        data: [totalCount["Pass"], totalCount["Fail"], totalCount["Not Graded"]]
      }];
      
      var key = new Date().getTime() + "0";
      taskChartList.push(
        <div key={key} style={{display: "inline-block", "marginRight": "30px"}}>
          <h3 className="chartHeading">
            Success Rate Across All Tasks
          </h3>
          <h4 style={{marginBottom: "5px"}}>No. of Tasks Completed by all Participants: {totalCount["Pass"] + totalCount["Fail"] + totalCount["Not Graded"]}</h4>
          <Chart
            options={options}
            series={series}
            type="bar"
            className="genericChart barChart"
          />
        </div>
      );
    }

    this.setState({[listName]: taskChartList});
  }

  getPieChartOptions() {
    var options = {
      chart: {
        type: 'pie'
      },
      plotOptions: {
        pie: {
          startAngle: 0,
          endAngle: 360,
          expandOnClick: true,
          offsetX: -10,
          offsetY: 10,
          customScale: 1,
          dataLabels: {
              offset: -10,
              minAngleToShowLabel: 0
          }, 
        },
      },
      dataLabels: {
        enabled: true,
        textAnchor: 'end',
        style: {
          fontSize: '16px',
          colors: ["#000000"],
          fontWeight: 'bold',
        },
        dropShadow: {
          enabled: false,
        },
      },
      legend: {
        fontSize: "16px",
        horizontalAlign: 'right',
        width: 200,
      }
    };

    return options;
  }

  createTextAnswerBox(answers, question) {
    var answerList = [];

    for (let j = 0; j < answers.length; j++) {
      var answerObj = answers[j];
      if (answerObj["questionId"] === question["questionId"]) {
        var answer = JSON.parse(answerObj["answerJSON"])["answer"];
        answerList.push(
          <div key={j}>
            <span style={{"fontWeight": "none"}}>{answer}</span>
            <hr style={{"margin": "5px 0 5px"}}></hr>
          </div>
        );
      }
    }

    return(
      <div>
        {answerList}
      </div>
    )
  }

  createMultipleChoicePieChart(options, answers, question) {
    var questionConfigsJSON = JSON.parse(question["questionConfigsJSON"]);

    // Create a dictionary with all the answer options and their count
    var labelsAndCount = {};
    var choices = questionConfigsJSON["choices"];
    for (let n = 0; n < choices.length; n++) {
      let choice = choices[n]["value"];
      labelsAndCount[choice] = 0;
    }
    // Iterate over answers and if the questionId matches then increment the value of the answer
    for (let j = 0; j < answers.length; j++) {
      var answerObj = answers[j];
      if (answerObj["questionId"] === question["questionId"]) {
        var answer = JSON.parse(answerObj["answerJSON"])["answer"];
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

    // console.log("Creating Chart!", options, options.labels, series);

    var pieChart = 
      <Chart
        options={options}
        series={series}
        type="pie"
        className="genericChart pieChart"
      />
    
    return pieChart;
  }

  renderAnswerCharts() {
    var answerChartList = [];
    var textAnswerList = [];
    var questions = this.state.questionAnswerData["questions"];
    var answers = this.state.questionAnswerData["answers"];

    // Iterate over questions
    for (let i = 0; i < questions.length; i++) {
      var options = this.getPieChartOptions();
      var question = questions[i];
      var questionConfigsJSON = JSON.parse(question["questionConfigsJSON"]);
      
      // Show multiple choice questions
      if (questionConfigsJSON["questionType"] === "multiple-choice") {
        var pieChart = this.createMultipleChoicePieChart(options, answers, question);

        answerChartList.push(
          <div key={i} className="pieChartContainer">
            <h3 className="chartHeading" >
              [{question["sequenceNumber"] + 1}] Question: <i>{questionConfigsJSON["questionText"]}</i>
            </h3>
            {pieChart}
          </div>
        );

      } else if (questionConfigsJSON["questionType"] === "text") {
        var textAnswerBox = this.createTextAnswerBox(answers, question);
        
        // console.log(textAnswerBox);

        textAnswerList.push(
          <div key={i} className="textAnswerContainer">
              <h3 className="chartHeading">
                [{question["sequenceNumber"] + 1}] Question: <i>{questionConfigsJSON["questionText"]}</i>
              </h3>
              <h4  style={{display: "block", textAlign: "left", margin: "5px 0 5px"}}>Answers: </h4>
              <div style={{"backgroundColor": "white", "padding": "5px 15px 15px", overflow: "auto", maxHeight: "250px"}}>
                {textAnswerBox}
              </div>
          </div>
        );
      }
    }

    this.setState({answerChartList: answerChartList});
    this.setState({textAnswerList: textAnswerList});
  }

  render() {
    return (
      <React.Fragment>

        <div style={{display: this.state.displayStatus}}>
          <h2>Details</h2>
          <hr className="hr2"></hr>
          <h3>No. of Participants: {this.state.instanceData.length}</h3>

          {this.state.taskGradeData["tasks"] ? (
            <h3>No. of Tasks: {this.state.taskGradeData["tasks"].length}</h3>
          ) : (
            null
          )}
          {this.state.questionAnswerData["questions"] ? (
            <h3>No. of Questions: {this.state.questionAnswerData["questions"].length}</h3>
          ) : (
            null
          )}
          <hr></hr>

          {this.state.instanceData.length > 0 ? (
            <span>
              <br></br>
              <div className="chartHolder">
                <h2>Overall Task Success Rate</h2>
                <hr className="hr2"></hr>
                {this.state.overallChart}
              </div>

              <br></br>
              <div className="chartHolder">
                <h2>Individual Task Performance</h2>
                <hr className="hr2"></hr>
                {this.state.taskChartList}
              </div>

              <br></br>
              <div className="chartHolder">
                <h2>Multiple-Choice Question Answers</h2>
                <hr className="hr2"></hr>
                {this.state.answerChartList}
              </div>

              <br></br>
              <div className="chartHolder">
                <h2>Text Question Answers</h2>
                <hr className="hr2"></hr>
                {this.state.textAnswerList}
              </div>
            </span>
          ) : ( 
            <span>
              <h3>There is no data to display as no participants have taken the test.</h3>
              <hr></hr>
            </span>
          )}
        </div>  
      </React.Fragment>
    )
  }
}

export default TestResultOverviewTab;
