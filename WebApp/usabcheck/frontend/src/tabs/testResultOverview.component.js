import React, { Component } from 'react';
import Server from "services/server.service";
// import ApexCharts from 'apexcharts'
import Chart from "react-apexcharts";

export class TestResultOverviewTab extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isShown: true,
      taskGradeData: {},
      questionAnswerData: {},
      taskChartList: [],
      overallChart: [],
      answerChartList: [],
      textAnswerList: [],
      emotionChart: [],
      participantCount: "N/A"
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
          this.renderTaskCharts("chartPerTask", "taskChartList");
          this.renderTaskCharts("overall", "overallChart");
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

    return options;
  }

  renderTaskCharts(type, listName) {
    var options = this.getTaskSettings()
    console.log(this.state.taskGradeData);

    var taskChartList = [];
    var tasks = this.state.taskGradeData["tasks"];
    var grades = this.state.taskGradeData["grades"];
    var gradeCount = {
      "Pass": 0,
      "Fail": 0,
      "Not Graded": 0
    }

    for (let i = 0; i < tasks.length; i++) {
      var task = tasks[i];
      
      if (type == "chartPerTask") {
        var gradeCount = {
          "Pass": 0,
          "Fail": 0,
          "Not Graded": 0
        }
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
      
      if (type == "chartPerTask") {
        taskChartList.push(
        <div key={i} style={{display: "inline-block", "marginRight": "30px"}}>
          <h3 className="chartHeading">
          [{task["sequenceNumber"] + 1}] {task.taskName}
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
    }

    if (type == "overall") {
      taskChartList.push(
      <div key={0} style={{display: "inline-block", "marginRight": "30px"}}>
        <h3 className="chartHeading">
          Success Rate Across All Tasks
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
          fontSize: '15px',
          colors: ["#000000"],
          fontWeight: 'bold',
        },
        dropShadow: {
          enabled: false,
        },
      },
      legend: {
        fontSize: "15px",
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

    console.log(answerList);

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

    console.log("Creating Chart!", options, options.labels, series);

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
            <h3 className="chartHeading">
              [{question["sequenceNumber"] + 1}] Question: <i>{questionConfigsJSON["questionText"]}</i>
              {pieChart}
            </h3>
          </div>
        );

      } else if (questionConfigsJSON["questionType"] === "text") {
        var textAnswerBox = this.createTextAnswerBox(answers, question);
        
        console.log(textAnswerBox);

        textAnswerList.push(
          <div key={i} className="pieChartContainer">
            <h3 className="chartHeading">
              [{question["sequenceNumber"] + 1}] Question: <i>{questionConfigsJSON["questionText"]}</i>
              <h4  style={{display: "block", textAlign: "left", margin: "5px 0 5px"}}>Answers: </h4>
              <div style={{"backgroundColor": "white", "padding": "5px 15px 15px", overflow: "auto", maxHeight: "300px"}}>
                {textAnswerBox}
              </div>
            </h3>
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
        {this.state.isShown ? (
          <div>
            <h2>Details</h2>
            <hr className="hr2"></hr>
            <h3>Participants{}</h3>

            <div>
              {this.state.emotionChart}
            </div>
            
            <br></br>
            <h2>Overall Task Success Rate</h2>
            <hr className="hr2"></hr>
            <div className="chartHolder">
              {this.state.overallChart}
            </div>

            <br></br>
            <h2>Individual Task Performance</h2>
            <hr className="hr2"></hr>
            <div className="chartHolder">
              {this.state.taskChartList}
            </div>

            <br></br>
            <h2>Multiple-Choice Question Answers</h2>
            <hr className="hr2"></hr>
            <div className="chartHolder">
              {this.state.answerChartList}
            </div>

            <br></br>
            <h2>Text Question Answers</h2>
            <hr className="hr2"></hr>
            <div className="chartHolder">
              {this.state.textAnswerList}
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
