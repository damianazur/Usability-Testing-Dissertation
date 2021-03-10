import React, { Component } from 'react';
import Vimeo from "@vimeo/player";
import DropdownGenerator from "components/dropdownGenerator.component";
import Server from "services/server.service";
import TaskGrading from "components/taskGrading.component";
import VideoBars from "components/videoBars.component";

export class TestResultOverviewTab extends Component {
  constructor(props) {
    super(props);

    this._videoBars = React.createRef();

    this.state = {
      displayStatus: "none",

      videoEmbed: [],
      player: {},
      testInstances: [],
      testDetails: [],
      testInstanceDropdown: [],
      videoTimeStamps: [],
      currentVideoId: null,//"512700005", //"510894964",
      videoFullScreen: false,
      videoDuration: 0,
      selectedTestInstaceId: null,

      taskGradeData: [],
      taskGradeBoxes: [],
      videoBars: []
    };
  }

  componentDidMount() {
    var testId = this.props.testId;
    this.getTestInstances(testId);
    // this.getVideoTimeStamps(20);
    this.getTestDetails(testId);
    // this.setVideoEmbed();
    // this.getTaskGradesByInstanceId(this.state.selectedTestInstaceId);

    window.addEventListener('resize', this.onVideoResize.bind(this));
  }

  componentDidUpdate() {
    
  }

  disable() {
    this.setState({displayStatus: "none"});
  }

  enable() {
    this.setState({displayStatus: ""}, () => {
      if (this._videoBars.current) {
        this._videoBars.current.onBarScroll();
      }
    });
  }

  // Get Data from Server
  getTestInstances(testId) {
    Server.getTestInstances(testId).then(response => {
      console.log(response.data);
      this.setState({
        testInstances: response.data}, () => {
          this.generateInstanceDropdown();
        });
    });
  }

  // Get Data from Server
  getTestDetails(testId) {
    Server.getTestsWithDetails(testId).then(response => {
      console.log(response.data);
      this.setState({
        testDetails: response.data
      });
    });
  }

  // Get Data from Server
  getVideoTimeStamps(testInstanceId) {
    Server.getVideoTimeStampsByInstanceId(testInstanceId).then(response => {
      this.setState({
        videoTimeStamps: response.data
      });
    });
  }

  // Get Data from Server
  getTaskGradesByInstanceId(testInstanceId) {
    Server.getTaskGradesByInstanceId(testInstanceId).then(response => {
      console.log(response.data);
      this.setState({
        taskGradeData: response.data}, () => {
          this.generateTaskGrading()
        });
    });
  }

  // Instance of a test selected from dropdown
  onInstanceSelect(params) {
    console.log(params)

    // Get video ID
    var paramsJson = JSON.parse(params)
    var testInstanceObj = paramsJson["testInstance"]
    var instanceId = testInstanceObj["testInstanceId"];
    var videoId = testInstanceObj["videoLocation"]
    videoId = videoId.replace('/videos/', '');

    console.log(videoId, instanceId)

    // Set videoID and get data
    this.setState({currentVideoId: videoId, selectedTestInstaceId: instanceId}, () => {
      this.setVideoEmbed();
      this.getVideoTimeStamps(instanceId);
      this.getTaskGradesByInstanceId(instanceId);

      // this.setVideoPlayer();
      // // Initialize player
      // var player = new Vimeo("videoEmbed");
      // this.state.player.getDuration().then(function(duration) {
      //   this.setState({
      //     player: player,
      //     videoDuration: duration,
      //     selectedTestInstaceId: paramsJson["testInstanceId"]
      //   });
      // }.bind(this));
    });
  }

  // Dropdown for selecting test instance
  generateInstanceDropdown() {
    let instances = this.state.testInstances;
    let menuItems = [];

    for(let i = 0; i < instances.length; i++) {
      let instance = instances[i];
      let item = {};

      item.name = "Test Instance " + (i + 1).toString();
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
    if (this.state.videoFullScreen === true && this.state.displayStatus != "none") {
      // Get the elements
      var videoContainer = document.getElementById('videoContainer');
      var contentBody = document.getElementById('recordingResultMainDiv-contentBody');
      var blackBackground = document.getElementById('blackBackground');
      
      // Get variables used in calculations
      var videoRatio = 1.777
      var screenHeight = window.innerHeight;
      var screenWidth = window.innerWidth;
      var heightAtFullWidth = screenWidth/videoRatio

      // Get the width of the video so that it fills either the width or height of the screen
      // but does not exceed either
      var setWidthPercent = 100;
      if (heightAtFullWidth > screenHeight) {
        var desiredWidth = (videoRatio * screenHeight);
        setWidthPercent = (desiredWidth / screenWidth * 100)
      }

      // The video goes to the top left corner
      videoContainer.style.position = "absolute";
      videoContainer.style.top = "0";
      videoContainer.style.left = "0";
      videoContainer.style.width = setWidthPercent + "%";

      // A margin is calculated to center the video if the width of the video
      // is less than the screen size
      var marginLeft = ((100 - setWidthPercent) / 2) + "%";
      if (parseInt(setWidthPercent) !== 100) {
        console.log(((setWidthPercent - 100) / 2) + "%");
        videoContainer.style.marginLeft = marginLeft
      }
      
      var videoEmbed = document.getElementById('videoEmbed');
      var videHeightPx = videoEmbed.clientHeight;

      // The content below the video is set to absolute position and positioned inline with the video
      contentBody.style.position = "absolute";
      contentBody.style.top = videHeightPx + "px";
      contentBody.style.left = "0";
      contentBody.style.paddingLeft = marginLeft;

      // The emotion/task bars are resized and adjusted
      // The on bar scroll function achieves this
      this._videoBars.current.onBarScroll();

      // Set the black 
      blackBackground.style.display = "";
      blackBackground.style.height = videHeightPx +  "px";

    } else if (this.state.videoFullScreen === false) {
      // When exiting fullscreen clear the CSS
      var clearStyleList = ["videoContainer", "recordingResultMainDiv-contentBody"];

      clearStyleList.forEach(function(elementName) {
        var element = document.getElementById(elementName);
        element.style.position = "";
        element.style.top = "";
        element.style.left = "";
        element.style.marginLeft = "";
        element.style.width = "";
      });

      blackBackground = document.getElementById('blackBackground');
      blackBackground.style.display = "none";

      // Update the video bars
      this._videoBars.current.onBarScroll();
    }
  } 

  setVideoPlayer(iframe) {  
    console.log("Setting video player");
    var player = new Vimeo("videoEmbed");

    var debounce = 2;
    // On fullscreen we want to exit fullscreen and fit the video to the browser window
    // making it a "fake" sort of fullscreen. This allows for scrolling down to the video bars and
    // other content
    player.on('fullscreenchange', function(data) {
      // The debounce is used because when entering/exiting fullscreen the 
      // event fullscreenchange is fired a few times. This is used to ignore the 
      // duplicate events
      if (debounce < 3) {
        debounce += 1;
        return;
      } else {
        debounce = 0;
      }

      // When user enters fullscreen, exit fullscreen
      if (data["fullscreen"] === true) {
        this.setState({videoFullScreen: !this.state.videoFullScreen});
        debounce = 0;

        player.exitFullscreen().then(function() {
          this.onVideoResize();

        }.bind(this)).catch(function(error) {
          console.log(error);
        });
      }
    }.bind(this));

    // Save video durating which will be used in the calculations
    player.getDuration().then(function(duration) {
      this.setState({
        player: player,
        videoDuration: duration
      });
    }.bind(this));
  }

  setVideoEmbed() {
    console.log("Setting video embed");
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

  // Used to jump to a time in the video when the user clicks on the bars
  setVideoTime(startTime) {
    this.state.player.setCurrentTime(startTime);
  }

  generateTaskGrading() {
    var taskGradeBoxes = [];

    var key = 0;
    this.state.taskGradeData.forEach(function(taskData) {
      taskGradeBoxes.push(
        <TaskGrading
          key={key}
          data={taskData}
          >
        </TaskGrading>
      )
      key += 1;
    });

    this.setState({taskGradeBoxes: taskGradeBoxes});
  }

  renderVideoBars() {
    // Ensure all the data has been loaded
    if (this.state.videoTimeStamps.length === 0 
        || this.state.videoDuration === 0
        || this.state.testDetails.length === 0
        || Object.keys(this.state.player).length === 0) {
      return;
    }

    var data = {};
    data.videoTimeStamps = this.state.videoTimeStamps;
    data.videoDuration = this.state.videoDuration;
    data.player = this.state.player;
    data.testDetails = this.state.testDetails;

    var functions = {};
    functions.setVideoTime = this.setVideoTime.bind(this);

    return (
      <VideoBars
        ref={this._videoBars}
        data={data}
        functions={functions}
        >
      </VideoBars>
    );
  }

  render() {
    return (
      <React.Fragment>
      <div style={{display: this.state.displayStatus}}>
        <div id="recordingResultMainDiv">
          <div>
            <div id="blackBackground"  style={{position:"absolute", top:"0", left:"0", width:"100%", height:"100%", display: "none"}}>
            </div>

            <div style={{marginBottom: "20px"}}>
              {this.state.testInstanceDropdown}
            </div>
            
            <div>
              <div id="videoContainer" style={{}}>
                {this.state.videoEmbed}
              </div>
            </div>
          </div>
          
          {this.state.currentVideoId != null ? (
            <div id="recordingResultMainDiv-contentBody">
              <div className="dividerContainer">
                {this.renderVideoBars()}
              </div>

              <div className="dividerContainer">
                <div id="taskGradingContainer">
                  <h2 style={{textAlign: "center"}}>Task Grading</h2>
                  {this.state.taskGradeBoxes}
                </div>
              </div>
            </div>
          ) : (
            null
          )}
        </div>
      </div>
    </React.Fragment>
    )
  }
}

export default TestResultOverviewTab;
