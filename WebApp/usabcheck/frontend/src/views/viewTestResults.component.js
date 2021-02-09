import React, { Component } from 'react';

import Server from "services/server.service";
import TabGenerator from "components/tabs.component"
import TestResultOverviewTab from "tabs/testResultOverview.component"
import TestResultRecordingsTab from "tabs/testResultRecordings.component"

export class ViewTestResults extends Component {
  constructor(props) {
    super(props);

  }
  render() {
    let testId = this.props.location.state.testId;

    var sendData = [
      {
        label: "Overview",
        tabComponent: TestResultOverviewTab
      }, {
        label: "Recordings",
        tabComponent: TestResultRecordingsTab
      }
    ];
    
    return (
      <div className="mainPageDiv">
          <h1>Test X: Results</h1>
          <hr></hr>
          <div className="post-content">  
            <TabGenerator
              data={sendData}
              testId={testId}
            ></TabGenerator>
          </div>
      </div>
    );
  }
}

export default ViewTestResults;
