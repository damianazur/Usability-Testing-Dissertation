import React, { Component } from 'react';

import ModalContainer from "components/modalContainer.component";
import DropdownGenerator from "components/dropdownGenerator.component";
import { DeleteTestForm } from 'forms/deleteTestForm';
import Server from "services/server.service";

export class TestContainer extends Component {
  constructor(props) {
    super(props);

    this._deleteTestModal = React.createRef();

    this.state = {
      selectedOption: "Settings"
    };
  }

  showDeletePopup() {
    // console.log("Delete Test Option Selected");
    this._deleteTestModal.current.setState({isShown: true});
  }

  deleteTest(e) {
    e.preventDefault();
    // console.log("Test delete", e);

    let testName = e.target.deleteTestName.value
    let testId = e.target.deleteTestId.value

    // console.log("Project submit!", e, testName, testId);

    this._deleteTestModal.current.setState({isShown: false});
    Server.deleteTest(testId, testName).then(response => {
      console.log(response);
      this.props.parentUpdate();
    });

  }

  generateOptionsDropdown = (test, selectedOption) => {
    let menuItems = [];

    let item = {};
    item.name = "Delete";
    item.params = {
      testName: test.testName,
      testId: test.testId
    };
    item.onSelectFunction = this.showDeletePopup.bind(this);

    menuItems.push(item);

    return (
      <DropdownGenerator data={menuItems} initalText={selectedOption}></DropdownGenerator>
    )
  }

  render() {
    // console.log("Test Container Props:", this.props);

    const test = this.props.testItem;

    const stats = [];

    stats.push(
      <div key="0">
        <div className="testStat">
          <span className="testStat-label">Task Pass:</span>
          <span>N/A</span>
        </div>
        <div className="testStat">
          <span className="testStat-label">Task Fail:</span>
          <span>N/A</span>
        </div>
        <div className="testStat">
          <span className="testStat-label">Participants:</span>
          <span>N/A</span>
        </div>
      </div>
    )

    return (
      <div className="dashboard-testBox">
        <div className="testBox-top">
          <span className="testBox-testName">
            {test.testName}
          </span>
          <span>
            <button onClick={() => {
                this.props.history.push({
                  pathname: 'view-test-details',
                  state: { testId: test.testId }
                });
                window.location.reload();
              }} type="button" className="secondaryButton">View Test Details
            </button>
            <span style={{float: "right"}}>
              {this.generateOptionsDropdown(test, this.state.selectedOption)}
            </span>
            <ModalContainer 
              Form={DeleteTestForm} 
              ref={this._deleteTestModal} 
              buttonClassName="secondaryButton deleteButton" 
              triggerText={""}
              onSubmit={this.deleteTest.bind(this)}
              details={test}
              disableButton={true}
            />  
          </span>
        </div>
        <hr className="testBox-seperator"></hr>
        <div className="testBox-bottom">
          <span className="testBox-bottom-left">
            <div>
              {test.status}
            </div>
            <div>
              <span className="testStat-label">Launched:</span>{test.launchedDate}
            </div>
          </span>
          <span className="testBox-bottom-right">
            {stats}
          </span>
        </div>
      </div>
    );
  }
}

export default TestContainer;
