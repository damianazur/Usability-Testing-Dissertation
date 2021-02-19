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
      videoDuration: 0,
      barSliderWindow: 0
    };
  }

  componentDidMount() {
    var testId = this.props.testId;
    this.updateTestInstances(testId);
    this.updateVideoTimeStamps(20);
    this.setVideoEmbed();
  }

  updateTestInstances(testId) {
    Server.getTestInstances(testId).then(response => {
      console.log(response.data);
      this.setState({
        testInstances: response.data}, () => {
          this.createtestInstanceDropdown();
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

  createtestInstanceDropdown() {
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


  setVideoPlayer(iframe) {  
    console.log("Setting video player");

    var player = new Vimeo("videoEmbed");

    var frameContainer = document.getElementById('videoEmbed')
    // frameContainer.requestFullscreen();

    player.on('fullscreenchange', function(data) {
      console.log(data);
      if (data["fullscreen"] == true) {
        player.exitFullscreen().then(function() {
          var videoContainer = document.getElementById('videoContainer')
          videoContainer.style.position = "absolute";
          videoContainer.style.top = "0";
          videoContainer.style.left = "0";
          
          var videoRatio = 1.777
          var screenHeight = window.innerHeight;
          var screenWidth = window.innerWidth;
          var heightAtFullWidth = screenWidth/videoRatio
          var widthPercentage = parseInt(((screenHeight * videoRatio) / screenWidth) * 100) + "%"

          console.log(screenHeight, screenHeight * videoRatio, widthPercentage, heightAtFullWidth);
          
          var setWidthPercent = 100;
          if (heightAtFullWidth > screenHeight) {
            var desiredWidth = (videoRatio * screenHeight);
            setWidthPercent = (desiredWidth / screenWidth * 100)
            console.log(desiredWidth, screenWidth);
          }

          console.log(setWidthPercent);
          // videoContainer.style.height =  "100vh"
          videoContainer.style.width = setWidthPercent + "%"
          if (parseInt(setWidthPercent) != 100) {
            console.log(((setWidthPercent - 100) / 2) + "%");
            videoContainer.style.marginLeft = ((100 - setWidthPercent) / 2) + "%";
          }
        }).catch(function(error) {
        });
      }
    });

    // player.on('play', function() {
    //   console.log('Video started playing');
    // });

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
      <div id="videoFrameContainer" allowFullScreen="true"
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
          allowFullScreen="true">
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

    if (frameContainer && this.state.player) {} else {
      return null;
    }

    console.log(this.state.videoDuration);

    var videoLength = this.state.videoDuration;
    var frameContainerWidth = frameContainer.clientWidth;
    var emotionBarWidth = frameContainerWidth - 266;

    var pixelTimeUnit;
    var height;
    if (type == "entire") {
      pixelTimeUnit = emotionBarWidth/videoLength;
      height = "18px"
    } else if (type == "zoomed-in") {
      pixelTimeUnit = 60;
      height = "38px";
    }

    console.log(pixelTimeUnit);
    var emotionSpanList = this.generateEmotionSpanList(pixelTimeUnit, height);

    var overflow = "";
    var paddingBottom = "";
    var barHeight = "";
    var barWidth = "";
    var innerBarId = "";
    var overflowY = "";
    if (type == "entire") {
      innerBarId = "innerBarEntire";
      barHeight = "20px";
      overflowY = "visible";
    } else if (type == "zoomed-in") {
      overflow = "scroll";
      paddingBottom = "35px";
      barHeight = "55px";
      barWidth = pixelTimeUnit * videoLength + "px";
      innerBarId = "innerBarZoomed";
      overflowY = "hidden";
    }

    // console.log("#####", overflow, emotionBarWidth);

    var barStyle = {
      position: "relative", 
      bottom: "-18px", 
      left: "94px", 
      width: emotionBarWidth + "px", 
      height: barHeight,
      backgroundColor: "black",
      border: "1px solid black",
      zIndex: 2147483646,
      overflow: overflow,
      overflowY: overflowY,
      paddingBottom: paddingBottom
    };

    var innerBarStyle =  {
      width: barWidth,
      position: "absolute"
    };

    var innerBar = 
      <div id={innerBarId} style={innerBarStyle}>
        {emotionSpanList}
      </div>

    // innerBar.addEventListener('scroll', this.onBarScroll);

    var emotionBar;
    
    if (type == "entire") {
      emotionBar = 
      <div 
        id="emotionbar" 
        style={barStyle}
        >
        {innerBar}

        <div style={{position: "absolute", left: "calc(" + this.state.barSliderWindow + "% - 2px)", top: -6, width: "calc(26% + 4px)", height: "30px", border: "2px solid white", zIndex: 3147483648}}>

        </div>
      </div>
    }
    else if (type == "zoomed-in") {
      emotionBar = 
      <div 
        id="zoomedBar" 
        style={barStyle}     
        onScroll={this.onBarScroll.bind(this)}
        >
        {innerBar}
      </div>
    }
    return emotionBar;
  }

  onBarScroll() {
    var barWidth = document.getElementById('zoomedBar').clientWidth;
    var innerBarWidth = document.getElementById('innerBarZoomed').clientWidth;
    var scrollPos = document.getElementById('zoomedBar').scrollLeft;
    var start = (scrollPos / innerBarWidth) * 100;
    var end = barWidth + scrollPos;
    var percentage = (barWidth / innerBarWidth);

    console.log(barWidth, scrollPos, barWidth + scrollPos, innerBarWidth, percentage.toFixed(2), start);
    this.setState({barSliderWindow: start});
  }

  render() {
    return (
      <React.Fragment>
      {this.state.isShown ? (
        <div id="recordingResultMainDiv">
          <div id="blackBackground"  style={{position:"absolute", top:"0", left:"0", width:"100%", height:"100%", backgroundColor:"black", display:"none"}}>

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
