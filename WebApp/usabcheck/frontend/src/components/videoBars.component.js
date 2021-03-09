import React, { Component } from 'react';

export class VideoBars extends Component {
  constructor(props) {
    super(props);

    this.state = {
      barSliderWindowX: 0, // The position of the zoomed in slider "window" on the "entire" bar
      barWindowWidth: 0,   // The size of the zoomed in slider "window" on the "entire" bar
      infoVisible: true,   // Hide/Show labels

      // DATA
      videoTimeStamps: this.props.data.videoTimeStamps, 
      testDetails: this.props.data.testDetails,
      player: this.props.data.player,
      videoDuration: this.props.data.videoDuration
    };
  }

  componentDidUpdate() {
    this.onBarScroll("firstRender");
  }

  componentDidMount() {
    this.onBarScroll("firstRender");
  }

  // Get the spans that make up the emotion bar
  generateEmotionSpanList(pixelTimeUnit, height) {
    var labelColours = {
      "Neutral": "none",
      "Sad": "#0099ff",
      "Happy": "#00ff00",     
      "Angry": "#ff0000",    
      "Fear": "#6600cc",
      "Disgust": "#333399",
      "Surprise": "#FFD800"
    }

    var emotionSpanList = [];
    for (let i = 0; i < this.state.videoTimeStamps.length; i++) {
      let timeStamp = this.state.videoTimeStamps[i];
      let type = timeStamp["type"]

      if (type === "emotion") {
        let startTime = parseFloat(timeStamp["startTime"])
        let endTime = parseFloat(timeStamp["endTime"]);
        let label = timeStamp["label"];

        if (label === "Neutral") {
          continue;
        }

        let color = labelColours[label];
        
        let offetX = pixelTimeUnit * startTime;
        let length = pixelTimeUnit * (endTime - startTime);

        if (length < 1) {
          length = 1;
        }

        if (!isNaN(length)) {
          emotionSpanList.push(
            <div key={i} className="timelineSpan" onClick={this.props.functions.setVideoTime.bind(this, startTime)}
              style={{
                position: "absolute",
                left: offetX, 
                width: length, 
                height: height,
                backgroundColor: color
                }}
              >
            </div>
          );
        }
      }
    }

    return emotionSpanList;
  }

  // Create the spans that make up the task bar
  generateTaskSpanList(pixelTimeUnit, height) {
    var labelColours = {
      "task": "rgb(127, 201, 255)",
      "text": "rgb(255, 233, 127)",     
      "multiple-choice": "rgb(255, 127, 127)"
    }

    var spanList = [];
    for (let i = 0; i < this.state.videoTimeStamps.length; i++) {
      let timeStamp = this.state.videoTimeStamps[i];
      let type = timeStamp["type"]

      if (type === "sequence") {
        let startTime = parseFloat(timeStamp["startTime"])
        let endTime = parseFloat(timeStamp["endTime"]);
        let sequenceNumber = timeStamp["label"];
        let sequenceItem = this.state.testDetails.sequenceData.find(item => item.sequenceNumber === parseInt(sequenceNumber));

        let color;
        if ("taskId" in sequenceItem) {
          color = labelColours["task"];
        } else if ("questionId" in sequenceItem) {
          let questionConfigsJSON = JSON.parse(sequenceItem["questionConfigsJSON"]);
          color = labelColours[questionConfigsJSON["questionType"]];
        }
        
        let offetX = pixelTimeUnit * startTime;
        let length = pixelTimeUnit * (endTime - startTime);

        if (length < 1) {
          length = 1;
        }

        if (!isNaN(length)) {
          spanList.push(
            <div key={i} className="timelineSpan" onClick={this.props.functions.setVideoTime.bind(this, startTime)}
              style={{
                position: "absolute",
                left: offetX, 
                width: length, 
                height: height,
                backgroundColor: color,
                borderRight: "1px solid black"
                }}
              >
            </div>
          );
        }
      }
    }
    // console.log("-------------")
    return spanList;
  }

  // Create a bar
  renderTimelineBar(type) {
    var frameContainer = document.getElementById('videoFrameContainer')

    // if video has not yet rendered and the player for the video was not yet created
    if (frameContainer && this.state.player && this.state.videoDuration !== 0) {} else {
      console.log("NULL CONDITION");
      return null;
    }

    var videoLength = this.state.videoDuration;
    var frameContainerWidth = frameContainer.clientWidth;
    var timelineBarWidth = frameContainerWidth - 266; // 266 is a consistent size of the labels next to the bar in vimeo

    // Generate the emotion strips that go inside the bar
    var pixelTimeUnit;
    var emotionStripHeight;
    var emotionSpanList;
    if (type === "entire") {
      pixelTimeUnit = timelineBarWidth/videoLength;
      emotionStripHeight = "18px"
      emotionSpanList = this.generateEmotionSpanList(pixelTimeUnit, emotionStripHeight);

    } else if (type === "zoomed-in") {
      pixelTimeUnit = 60;
      emotionStripHeight = "38px";
      emotionSpanList = this.generateEmotionSpanList(pixelTimeUnit, emotionStripHeight);
    
    }  else if (type === "task") {
      pixelTimeUnit = timelineBarWidth/videoLength;
      var taskStripHeight = "14px";
      var taskSpanList = this.generateTaskSpanList(pixelTimeUnit, taskStripHeight);
    }

    // Create the requested emotion bar
    var timelineBar;
    if (type === "entire") {
      timelineBar = this.createEntireBar(emotionSpanList, timelineBarWidth);

    } else if (type === "zoomed-in"){
      var innerBarWidth = (pixelTimeUnit * videoLength) + "px";
      // console.log(innerBarWidth);
      var innerBarStyle =  {
        width: innerBarWidth,
        position: "absolute"
      };
      timelineBar = this.createZoomedBar(emotionSpanList, timelineBarWidth, innerBarStyle);

    } else if (type === "task"){
      timelineBar = this.createTaskBar(taskSpanList, timelineBarWidth);
    }

    return timelineBar;
  }

  // Create the bar the shows the data across the entire video. Hence, "entire bar"
  createEntireBar(emotionSpanList, emotionBarWidth) {
    var barStyle = {
      width: emotionBarWidth + "px", 
    };

    var emotionBar = 
      <div className="genericVideoBar" id="entireEmotionBar" style={barStyle}>
        <div id="innerBarEntire" style={{position: "absolute"}}></div>
        {emotionSpanList}

        <div id="barSliderWindow" style={{
          left: "calc(" + this.state.barSliderWindowX + "% - 2px)", 
          width: "calc(" + this.state.barWindowWidth + "% + 6px)"
          }}>
        </div>
      </div>

    return emotionBar;
  }

  // Create a bar that zooms in on the portion of the entire bar. Hence, zoomed-in bar
  createZoomedBar(emotionSpanList, emotionBarWidth, innerBarStyle) {
    var barStyle = {
      width: emotionBarWidth + "px", 
    };

    var emotionBar = 
      <div className="genericVideoBar" id="zoomedBar" style={barStyle} onScroll={this.onBarScroll.bind(this)}>
        <div id="innerBarZoomed" style={innerBarStyle}>
          {emotionSpanList}
        </div>
      </div>

    return emotionBar;
  }

  // Creathe the bar that shows when the user starts and ends tasks and questions
  createTaskBar(taskSpanList, barWidth) {
    var barStyle = {
      width: barWidth + "px", 
    };

    var taskBar = 
      <div className="genericVideoBar" id="entireTaskBar" style={barStyle}>
        <div id="innerBarEntire" style={{position: "absolute"}}></div>
        {taskSpanList}
      </div>
    
    return taskBar;
  }

  // This method is used to move the window slider on the "entire" bar 
  onBarScroll(caller) {
    var zoomedBar = document.getElementById('zoomedBar');
    var innerBar = document.getElementById('innerBarZoomed');

    if (!zoomedBar) {
      return;
    }
    if (caller === "firstRender") {
      if (this.state.barWindowWidth !== 0) {
        return;
      }
    }
    var innerBarWidth = innerBar.clientWidth;
    if (innerBarWidth === 0){
      return;
    }

    var barWidth = zoomedBar.clientWidth;
    var scrollPos = zoomedBar.scrollLeft;
    var barWindowStart = (scrollPos / innerBarWidth) * 100;
    var barWindowWidthPercentage = (barWidth / innerBarWidth) * 100;

    this.setState({
      barSliderWindowX: barWindowStart,
      barWindowWidth: barWindowWidthPercentage
    });
  }

  // Creates the legend for the emotions bar and the task bar
  renderLegend(type) {
    var legendList = [];
    if (type === "emotion") {
      var legendDataList = [
        {label: "Happy", color: "#00ff00"},
        {label: "Sad", color: "#0099ff"},
        {label: "Angry", color: "#ff0000"},
        {label: "Surprise", color: "#FFD800"},
        {label: "Fear", color: "#6600cc"},
        {label: "Disgust", color: "#333399"}
      ];

      var key = 0;
      legendDataList.forEach(function(item) {
        legendList.push(
          <div key={key} style={{marginTop: "5px", display: "inline-block"}}>
            <span style={{backgroundColor: item.color}} className="legendColorBox"></span>
            <span className="legendText">{item.label}</span>
          </div>
        )
        key += 1;
      });

    } else if (type === "task") {
      var legendDataList = [
        {label: "Task", color: "rgb(127, 201, 255)"},
        {label: "Text Question", color: "rgb(255, 233, 127)"},
        {label: "Multiple-Choice Question", color: "rgb(255, 127, 127)"},
      ];

      var key = 0;
      legendDataList.forEach(function(item) {
        legendList.push(
          <div key={key} style={{marginTop: "5px", display: "inline-block"}}>
            <span style={{backgroundColor: item.color}} className="legendColorBox"></span>
            <span className="legendText">{item.label}</span>
          </div>
        )
        key += 1;
      });
    }

    return (
      <div>
        {legendList}
      </div>
    )
  }

  // Hide/Show labels and other info
  toggleHidableInfo(a) {
    var toToggle = document.getElementsByClassName('hidableInfo');
    var spacers = document.getElementsByClassName('spacer');
    
    var newStatus;
    if (this.state.infoVisible) {
      newStatus = "none";
    } else {
      newStatus = "";
    }
    for (var i = 0; i < toToggle.length; i++) {
      toToggle[i].style.display = newStatus;
    }
    for (i = 0; i < spacers.length; i++) {
      spacers[i].style.display = "inline-block";
    }

    this.setState({infoVisible: !this.state.infoVisible});
  }

  render() {
    return (
      <div>
        <label>Show Labels</label><input style={{marginLeft: "10px"}} type="checkbox" defaultChecked={this.state.infoVisible} onChange={this.toggleHidableInfo.bind(this)} />
        <div id="videoBarsContainer"> 
          <h2 className="barLabels hidableInfo" style={{textAlign: "center"}}>Entire Video Timeline</h2>
          <h3 className="barLabels hidableInfo" style={{textAlign: "left", marginLeft: "10px", marginBottom: "5px"}}>Emotions</h3>
          {this.renderTimelineBar("entire")}
          <div className="legendContainer hidableInfo">
            {this.renderLegend("emotion")}
          </div>

          <h3 className="barLabels hidableInfo" style={{textAlign: "left", marginLeft: "10px", marginBottom: "5px", marginTop: "10px"}}>Tasks</h3>
          <span className="spacer" style={{"display": "none", margin: "0px", height: "0px", padding: "0px"}}></span>
          {this.renderTimelineBar("task")}
          <div className="legendContainer hidableInfo">
            {this.renderLegend("task")}
          </div>
          
          <br></br>
          <h2 className="barLabels hidableInfo" style={{textAlign: "center", marginTop: "40px"}}>Zoomed-in Emotions Timeline</h2>
          {this.renderTimelineBar("zoomed-in")}
        </div>
      </div>
    )
  }
}

export default VideoBars;
