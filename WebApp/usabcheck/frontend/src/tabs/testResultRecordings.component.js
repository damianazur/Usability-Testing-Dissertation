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
      videoDuration: 0
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

  renderEmotionBar() {
    var frameContainer = document.getElementById('videoFrameContainer')

    if (frameContainer && this.state.player) {
      console.log(this.state.videoDuration);

      var videoLength = this.state.videoDuration;
      var frameContainerWidth = frameContainer.clientWidth;
      var emotionBarWidth = frameContainerWidth - 268;

      var labelColours = {
        "Neutral": "none",
        "Sad": "#0099ff",
        "Happy": "#00ff00",     
        "Angry": "#ff0000",    
        "Fear": "#6600cc",
        "Disgust": "#333399",
      }

      var pixelTimeUnit = emotionBarWidth/videoLength;

      console.log(pixelTimeUnit);

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

          console.log(offetX);

          if (!isNaN(length)) {
            emotionSpanList.push(
              <div key={i} onClick={this.setVideoTime.bind(this, startTime)}
                style={{
                  position: "absolute",
                  // display: "inline-block",
                  left: offetX, 
                  width: length, 
                  height: "18px",
                  backgroundColor: color
                  }}
                >
              </div>
            );
          }
        }
      }

      console.log(emotionSpanList);

      var emotionBar = 
      <div 
        id="emotionbar" 
        style={{
          position: "relative", 
          bottom: "-18px", 
          left: "95px", 
          width: "calc(90% - 266px)", 
          height: "20px", 
          backgroundColor: "black",
          border: "1px solid black",
          zIndex: 2147483647
        }}
        >
        {emotionSpanList}
      </div>

      return emotionBar;
    }
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

          {/* {this.getIframeDetails()} */}
          {this.renderEmotionBar()}
        </div>
      ) : ( 
        null
      )}
    </React.Fragment>
    )
  }
}

export default TestResultOverviewTab;
