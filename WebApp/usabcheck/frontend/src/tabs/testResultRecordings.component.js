import React, { Component } from 'react';
import ReactPlayer from "react-player";
import Vimeo from "@vimeo/player";
import DropdownGenerator from "components/dropdownGenerator.component";
import Server from "services/server.service";

export class TestResultOverviewTab extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isShown: true,
      videoEmbed: [],
      player: {},
      testInstances: [],
      testDetails: [],
      testInstanceDropdown: [],
      videoTimeStamps: [],
      currentVideoId: "512700005", //"510894964",
      videoFullScreen: false,
      videoDuration: 0,
      barSliderWindowX: 0,
      barWindowWidth: 0,
      infoVisible: true
    };
  }

  componentDidMount() {
    var testId = this.props.testId;
    this.getTestInstances(testId);
    this.getVideoTimeStamps(20);
    this.getTestDetails(testId);
    this.setVideoEmbed();

    window.addEventListener('resize', this.onVideoResize.bind(this));
  }

  componentDidUpdate() {
    this.onBarScroll("firstRender");
  }

  getTestInstances(testId) {
    Server.getTestInstances(testId).then(response => {
      console.log(response.data);
      this.setState({
        testInstances: response.data}, () => {
          this.generateInstanceDropdown();
        });
    });
  }

  getTestDetails(testId) {
    Server.getTestsWithDetails(testId).then(response => {
      console.log(response.data);
      this.setState({
        testDetails: response.data
      });
    });
  }

  getVideoTimeStamps(testInstanceId) {
    console.log(testInstanceId);
    Server.getVideoTimeStampsByInstanceId(testInstanceId).then(response => {
      console.log(response.data);
      this.setState({
        videoTimeStamps: response.data
      });
    });
  }

  onInstanceSelect(params) {
    console.log(params)

    var paramsJson = JSON.parse(params)
    var testInstanceObj = paramsJson["testInstance"]

    var videoId = testInstanceObj["videoLocation"]
    var videoId = videoId.replace('/videos/', '');

    this.setState({currentVideoId: videoId})
    console.log(testInstanceObj["testInstanceId"])
    this.getVideoTimeStamps(testInstanceObj["testInstanceId"]);

    var player = new Vimeo("videoEmbed");
    player.setCurrentTime(6)
    player.on('play', function() {
      console.log('Video started playing');
    });

    this.state.player.getDuration().then(function(duration) {
      this.setState({
        player: player,
        videoDuration: duration
      });
    }.bind(this));

    // this.setState({player: player});
  }

  generateInstanceDropdown() {
    let instances = this.state.testInstances;
    let menuItems = [];

    for(let i = 0; i < instances.length; i++) {
      let instance = instances[i];
      let item = {};

      item.name = "Test Instance " + i.toString();
      item.params = {
        testInstance: instance
      };
      item.onSelectFunction = this.onInstanceSelect.bind(this);

      menuItems.push(item);
    }

    var instanceDropdown = <DropdownGenerator data={menuItems} initalText={"Select a Test Instance"}></DropdownGenerator>;
    this.setState({"testInstanceDropdown": instanceDropdown});
  }

  onVideoResize() {
    if (this.state.videoFullScreen == true) {
      var videoContainer = document.getElementById('videoContainer');
      var videoBarsContainer = document.getElementById('videoBarsContainer');
      var recordingResultMainDiv = document.getElementById('recordingResultMainDiv');
      var blackBackground = document.getElementById('blackBackground');

      videoContainer.style.position = "absolute";
      videoContainer.style.top = "0";
      videoContainer.style.left = "0";

      videoBarsContainer.style.position = "absolute";
      videoBarsContainer.style.top = "0";
      videoBarsContainer.style.left = "0";

      var videoRatio = 1.777
      var screenHeight = window.innerHeight;
      var screenWidth = window.innerWidth;
      var heightAtFullWidth = screenWidth/videoRatio
      var widthPercentage = parseInt(((screenHeight * videoRatio) / screenWidth) * 100) + "%"

      var setWidthPercent = 100;
      if (heightAtFullWidth > screenHeight) {
        var desiredWidth = (videoRatio * screenHeight);
        setWidthPercent = (desiredWidth / screenWidth * 100)
        console.log(desiredWidth, screenWidth);
      }

      videoContainer.style.width = setWidthPercent + "%"
      if (parseInt(setWidthPercent) != 100) {
        console.log(((setWidthPercent - 100) / 2) + "%");
        videoContainer.style.marginLeft = ((100 - setWidthPercent) / 2) + "%";
        videoBarsContainer.style.marginLeft = ((100 - setWidthPercent) / 2) + "%";
      }
      
      var videoEmbed = document.getElementById('videoEmbed');
      var videoWidthPx = videoEmbed.clientWidth;
      var videHeightPx = videoEmbed.clientHeight;
      videoBarsContainer.style.width = videoWidthPx + "px";
      videoBarsContainer.style.top = videHeightPx + "px";
      this.onBarScroll();

      recordingResultMainDiv.style.height = videHeightPx + videoBarsContainer.clientHeight - 360 + "px";

      blackBackground.style.display = "";
      blackBackground.style.height = videHeightPx +  "px";

    } else if (this.state.videoFullScreen == false) {
      var clearStyleList = ["videoContainer", "videoBarsContainer"];

      clearStyleList.forEach(function(elementName) {
        var element = document.getElementById(elementName);
        element.style.position = "";
        element.style.top = "";
        element.style.left = "";
        element.style.marginLeft = "";
        element.style.width = "";
      }.bind(this));

      var blackBackground = document.getElementById('blackBackground');
      blackBackground.style.display = "none";

      this.onBarScroll();
    }
  } 

  setVideoPlayer(iframe) {  
    var player = new Vimeo("videoEmbed");

    var debounce = 2;
    player.on('fullscreenchange', function(data) {
      if (debounce < 3) {
        debounce += 1;
        return;
      } else {
        debounce = 0;
      }

      if (data["fullscreen"] == true) {
        this.setState({videoFullScreen: !this.state.videoFullScreen});
        console.log(this.state.videoFullScreen);
        debounce = 0;

        player.exitFullscreen().then(function() {
          this.onVideoResize();

        }.bind(this)).catch(function(error) {
          console.log(error);
        });
      }
    }.bind(this));

    player.getDuration().then(function(duration) {
      this.setState({
        player: player,
        videoDuration: duration
      });
    }.bind(this));
  }

  setVideoEmbed() {
    console.log("Rendering video embed");

    var src = "https://player.vimeo.com/video/" + this.state.currentVideoId + "?portrait=0&byline=0&title=0";

    var iframe =  
      <div id="videoFrameContainer" allowFullScreen
        style={{
          padding: "56.25% 0 0 0", 
          position: "relative"}}>
        <iframe 
          id="videoEmbed"
          ref={this.setVideoPlayer.bind(this)}
          src={src}
          style={{position:"absolute", top:"0", left:"0", width:"100%", height:"100%"}}
          frameBorder="0" 
          allow="autoplay; fullscreen; picture-in-picture" 
          allowFullScreen>
        </iframe>
      </div>

    this.setState({videoEmbed: iframe});
  }

  setVideoTime(startTime) {
    this.state.player.setCurrentTime(startTime);
  }

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

      if (type == "emotion") {
        let startTime = parseFloat(timeStamp["startTime"])
        let endTime = parseFloat(timeStamp["endTime"]);
        let label = timeStamp["label"];

        if (label == "Neutral") {
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
            <div key={i} className="timelineSpan" onClick={this.setVideoTime.bind(this, startTime)}
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

  generateTaskSpanList(pixelTimeUnit, height) {
    var labelColours = {
      "task": "rgb(127, 201, 255)",
      "text": "rgb(255, 233, 127)",     
      "multiple-choice": "rgb(255, 127, 127)"
    }

    // console.log(this.state.videoTimeStamps.length);

    var spanList = [];
    for (let i = 0; i < this.state.videoTimeStamps.length; i++) {
      let timeStamp = this.state.videoTimeStamps[i];
      let type = timeStamp["type"]

      if (type == "sequence") {
        // console.log(timeStamp);
        let startTime = parseFloat(timeStamp["startTime"])
        let endTime = parseFloat(timeStamp["endTime"]);
        let sequenceNumber = timeStamp["label"];
        let sequenceItem = this.state.testDetails.sequenceData.find(item => item.sequenceNumber == sequenceNumber);
        // let itemType = sequenceItem.questionConfigsJSON.toString();
        // console.log(sequenceItem);
        // console.log(endTime);
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
            <div key={i} className="timelineSpan" onClick={this.setVideoTime.bind(this, startTime)}
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

  renderTimelineBar(type) {
    var frameContainer = document.getElementById('videoFrameContainer')

    // if video has not yet rendered and the player for the video was not yet created
    if (frameContainer && this.state.player && this.state.videoDuration != 0) {} else {
      return null;
    }

    var videoLength = this.state.videoDuration;
    var frameContainerWidth = frameContainer.clientWidth;
    var timelineBarWidth = frameContainerWidth - 266; // 266 is a consistent size of the labels next to the bar in vimeo

    // Generate the emotion strips that go inside the bar
    var pixelTimeUnit;
    var emotionStripHeight;
    var emotionSpanList;
    if (type == "entire") {
      pixelTimeUnit = timelineBarWidth/videoLength;
      emotionStripHeight = "18px"
      emotionSpanList = this.generateEmotionSpanList(pixelTimeUnit, emotionStripHeight);

    } else if (type == "zoomed-in") {
      pixelTimeUnit = 60;
      emotionStripHeight = "38px";
      emotionSpanList = this.generateEmotionSpanList(pixelTimeUnit, emotionStripHeight);
    
    }  else if (type == "task") {
      pixelTimeUnit = timelineBarWidth/videoLength;
      var taskStripHeight = "14px";
      var taskSpanList = this.generateTaskSpanList(pixelTimeUnit, taskStripHeight);
    }


    // Create the requested emotion bar
    var timelineBar;
    if (type == "entire") {
      timelineBar = this.createEntireBar(emotionSpanList, timelineBarWidth);

    } else if (type == "zoomed-in"){
      var innerBarWidth = (pixelTimeUnit * videoLength) + "px";
      // console.log(innerBarWidth);
      var innerBarStyle =  {
        width: innerBarWidth,
        position: "absolute"
      };
      timelineBar = this.createZoomedBar(emotionSpanList, timelineBarWidth, innerBarStyle);

    } else if (type == "task"){
      timelineBar = this.createTaskBar(taskSpanList, timelineBarWidth);
    }

    return timelineBar;
  }

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

  onBarScroll(caller) {
    var zoomedBar = document.getElementById('zoomedBar');
    var innerBar = document.getElementById('innerBarZoomed');

    if (!zoomedBar) {
      return;
    }
    if (caller == "firstRender") {
      if (this.state.barWindowWidth != 0) {
        return;
      }
    }
    var innerBarWidth = innerBar.clientWidth;
    if (innerBarWidth == 0){
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

  renderLegend(type) {
    var legendList = [];
    if (type == "emotion") {
      var legendDataList = [
        {label: "Happy", color: "#00ff00"},
        {label: "Sad", color: "#0099ff"},
        {label: "Angry", color: "#ff0000"},
        {label: "Surprise", color: "#FFD800"},
        {label: "Fear", color: "#6600cc"},
        {label: "Disgust", color: "#333399"}
      ];

      legendDataList.forEach(function(item) {
        legendList.push(
          <div style={{marginTop: "5px", display: "inline-block"}}>
            <span style={{backgroundColor: item.color}} className="legendColorBox"></span>
            <span className="legendText">{item.label}</span>
          </div>
        )
      }.bind(this));

    } else if (type == "task") {
      var legendDataList = [
        {label: "Task", color: "rgb(127, 201, 255)"},
        {label: "Text Question", color: "rgb(255, 233, 127)"},
        {label: "Multiple-Choice Question", color: "rgb(255, 127, 127)"},
      ];

      legendDataList.forEach(function(item) {
        legendList.push(
          <div style={{marginTop: "5px", display: "inline-block"}}>
            <span style={{backgroundColor: item.color}} className="legendColorBox"></span>
            <span className="legendText">{item.label}</span>
          </div>
        )
      }.bind(this));
    }

    return (
      <div>
        {legendList}
      </div>
    )
  }


  toggleHidableInfo(a) {
    var toToggle = document.getElementsByClassName('hidableInfo');
    
    var newStatus;
    if (this.state.infoVisible) {
      newStatus = "none";
    } else {
      newStatus = "";
    }
    for (var i = 0; i < toToggle.length; i++) {
      toToggle[i].style.display = newStatus;
    }

    this.setState({infoVisible: !this.state.infoVisible});
  }

  render() {
    return (
      <React.Fragment>
      {this.state.isShown ? (
        <div id="recordingResultMainDiv">
          <div id="blackBackground"  style={{position:"absolute", top:"0", left:"0", width:"100%", height:"100%", display: "none"}}>
          </div>

          <div style={{marginBottom: "20px"}}>
            {this.state.testInstanceDropdown}
          </div>
          
          {this.state.currentVideoId != null ? (
            <div>
              <div id="videoContainer" style={{}}>
                {this.state.videoEmbed}
              </div>
            </div>
          ) : (
            null
          )}

          <div id="videoBarsContainer"> 
            <h2 className="barLabels hidableInfo" style={{textAlign: "center"}}>Entire Video Timeline</h2>
            <h3 className="barLabels hidableInfo" style={{textAlign: "left", marginLeft: "95px", marginBottom: "5px"}}>Emotions</h3>
            {this.renderTimelineBar("entire")}
            <div className="legendContainer hidableInfo">
              {this.renderLegend("emotion")}
            </div>

            <h3 className="barLabels hidableInfo" style={{textAlign: "left", marginLeft: "95px", marginBottom: "5px", marginTop: "10px"}}>Tasks</h3>
            {this.renderTimelineBar("task")}
            <div className="legendContainer hidableInfo">
              {this.renderLegend("task")}
            </div>

            <br></br>
            <h2 className="barLabels hidableInfo" style={{textAlign: "center"}}>Zoomed-in Emotions Timeline</h2>
            {this.renderTimelineBar("zoomed-in")}
          </div>
          
          <input type="checkbox" defaultChecked={this.state.infoVisible} onChange={this.toggleHidableInfo.bind(this)} />
        </div>
      ) : ( 
        null
      )}
    </React.Fragment>
    )
  }
}

export default TestResultOverviewTab;
