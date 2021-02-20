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
      testInstanceDropdown: [],
      videoTimeStamps: [],
      currentVideoId: "512700005", //"510894964",
      videoFullScreen: false,
      videoDuration: 0,
      barSliderWindowX: 0,
      barWindowWidth: 0
    };
  }

  componentDidMount() {
    var testId = this.props.testId;
    this.updateTestInstances(testId);
    this.updateVideoTimeStamps(20);
    this.setVideoEmbed();

    window.addEventListener('resize', this.videoResize.bind(this));
  }

  componentDidUpdate() {
    this.onBarScroll("firstRender");
  }

  updateTestInstances(testId) {
    Server.getTestInstances(testId).then(response => {
      console.log(response.data);
      this.setState({
        testInstances: response.data}, () => {
          this.generateInstanceDropdown();
        });
    });
  }

  updateVideoTimeStamps(testInstanceId) {
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
    this.updateVideoTimeStamps(testInstanceObj["testInstanceId"]);

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

  videoResize() {
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
          this.videoResize();

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
    }

    var emotionSpanList = [];
    for (let i = 0; i < this.state.videoTimeStamps.length; i++) {
      let timeStamp = this.state.videoTimeStamps[i];
      let type = timeStamp["type"]

      if (type == "emotion") {
        let startTime = parseFloat(timeStamp["startTime"])
        let endTime = parseFloat(timeStamp["endTime"]);
        let label = timeStamp["label"]
        let color = labelColours[label];
        
        let offetX = pixelTimeUnit * startTime;
        let length = pixelTimeUnit * (endTime - startTime);

        if (length < 1) {
          length = 1;
        }

        if (!isNaN(length)) {
          emotionSpanList.push(
            <div key={i} onClick={this.setVideoTime.bind(this, startTime)}
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

  renderEmotionBar(type) {
    var frameContainer = document.getElementById('videoFrameContainer')

    // if video has not yet rendered and the player for the video was not yet created
    if (frameContainer && this.state.player && this.state.videoDuration != 0) {} else {
      return null;
    }

    var videoLength = this.state.videoDuration;
    var frameContainerWidth = frameContainer.clientWidth;
    var emotionBarWidth = frameContainerWidth - 266; // 266 is a consistent size of the labels next to the bar in vimeo

    // Generate the emotion strips that go inside the bar
    var pixelTimeUnit;
    var emotionStripHeight;
    if (type == "entire") {
      pixelTimeUnit = emotionBarWidth/videoLength;
      emotionStripHeight = "18px"
    } else if (type == "zoomed-in") {
      pixelTimeUnit = 60;
      emotionStripHeight = "38px";
    }
    var emotionSpanList = this.generateEmotionSpanList(pixelTimeUnit, emotionStripHeight);

    // Create the requested emotion bar
    var emotionBar;
    if (type == "entire") {
      emotionBar = this.createEntireBar(emotionSpanList, emotionBarWidth);

    } else if (type == "zoomed-in"){
      var innerBarWidth = (pixelTimeUnit * videoLength) + "px";
      // console.log(innerBarWidth);
      var innerBarStyle =  {
        width: innerBarWidth,
        position: "absolute"
      };
      emotionBar = this.createZoomedBar(emotionSpanList, emotionBarWidth, innerBarStyle);
    }

    return emotionBar;
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

  render() {
    return (
      <React.Fragment>
      {this.state.isShown ? (
        <div id="recordingResultMainDiv">
          {/* <div
            id="blackBackground" 
            style={{position:"absolute", top:"0", left:"0", width:"100%", height:"100%", zIndex: 0, backgroundColor:"black"}}>
          </div> */}
          <div id="blackBackground"  style={{position:"absolute", top:"0", left:"0", width:"100%", height:"100%", display: "none"}}>
          </div>

          <div>
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
            {this.renderEmotionBar("entire")}
            <br></br>
            {this.renderEmotionBar("zoomed-in")}
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
