import React, { Component } from 'react';

import ModalContainer from "components/modalContainer.component";
import DropdownGenerator from "components/dropdownGenerator.component";
import { DeleteTestForm } from 'forms/deleteTestForm';
import Server from "services/server.service";
import { createNotification } from 'utilities/utils.js';

import { CreateInfoModals, CreateInfoButton } from 'modal/infoModalUtilities'; 
import { ReferenceNumInfoForm, StatusInfoForm } from 'forms/infoForms';

export class TestContainer extends Component {
  constructor(props) {
    super(props);

    this._deleteTestModal = React.createRef();

    this.state = {
      selectedOption: "Settings",
      taskGradeData: [],
      questionAnswerData: [],
      instanceData: []
    };

    // console.log(this.props.testItem);
  }

  componentDidMount() {
    const test = this.props.testItem;

    // console.log("####", test);
    this.updateTaskGrades(test.testId);
    this.updateQuestionAnswers(test.testId);
    this.updateInstanceData(test.testId);
    this.setInfoModals();
  }

  showDeletePopup() {
    // console.log("Delete Test Option Selected");
    this._deleteTestModal.current.setState({isShown: true});
  }

  deleteTest(e) {
    e.preventDefault();
    let testName = e.target.deleteTestName.value
    let testId = e.target.deleteTestId.value

    this._deleteTestModal.current.setState({isShown: false});
    Server.deleteTest(testId, testName).then(response => {
      // console.log(response);
      createNotification('success', "Test Deleted Successfully!");
      this.props.parentUpdate();
      },
      error => {
        const resMessage = (
          error.response &&
          error.response.data &&
          error.response.data.message) || 
          error.message ||
          error.toString();
        
        console.log(error.message);
        createNotification("error", error.toString());

        this.setState({
          loading: false,
          message: resMessage
        });
      }
    );
  }

  updateTaskGrades(testId) {
    Server.getTasksAndGrades(testId).then(response => {
      this.setState({taskGradeData: response.data});
    });
  }

  updateQuestionAnswers(testId) {
    // console.log(testId);
    Server.getQuestionAndAnswers(testId).then(response => {
      // console.log(response.data);
      this.setState({questionAnswerData: response.data});
    });
  }

  updateInstanceData(testId) {
    Server.getTestInstances(testId).then(response => {
      this.setState({instanceData: response.data});
    });
  }

  changeTestStatus(statusName) {
    var testId = this.props.testItem.testId;

    Server.changeTestStatus(testId, statusName).then(response => {
      // console.log(response.data);
      this.props.parentUpdate();
    });

    // console.log(testId, statusName);
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

    item = {};
    var changeToStatus = "";
    if (this.props.testItem.testStatus == "Open") {
      item.name = "Close";
      changeToStatus = "Closed"
    } else if (this.props.testItem.testStatus == "Closed") {
      item.name = "Open";
      changeToStatus = "Open"
    }
    item.params = {
      testName: test.testName,
      testId: test.testId
    };
    item.onSelectFunction = this.changeTestStatus.bind(this, changeToStatus);

    menuItems.push(item);

    return (
      <DropdownGenerator data={menuItems} initalText={selectedOption}></DropdownGenerator>
    )
  }

  renderStats() {

    // console.log(this.props.testItem.testId, this.state.taskGradeData["tasks"]);
    return (
      <div>
        <div className="testStat">
          <span className="testStat-label">No. of Tasks:</span>
          {this.state.taskGradeData["tasks"] ? (
            <span>{this.state.taskGradeData["tasks"].length}</span>
          ) : (
            null
          )}
        </div>
        
        <div className="testStat">
          <span className="testStat-label">No. of Questions:</span>
          {this.state.questionAnswerData["questions"] ? (
            <span>{this.state.questionAnswerData["questions"].length}</span>
          ) : (
            null
          )}
        </div>
        
        <div className="testStat">
          <span className="testStat-label">No. of Participants:</span>
          {this.state.instanceData ? (
            <span>{this.state.instanceData.length}</span>
          ) : (
            null
          )}
        </div>
      </div>
    );
  }

  setInfoModals() {
    var nameFormPair = {
      "reference": ReferenceNumInfoForm,
      "status": StatusInfoForm,
    }
    var returnData = CreateInfoModals(nameFormPair);
    this.setState({
      modalList: returnData.modalList, 
      infoRefPair: returnData.infoRefPair
    })
  }
  
  showInfoModal(modalName) {
    var ref = this.state.infoRefPair[modalName];
    ref.current.showModal();
  }

  render() {
    const test = this.props.testItem;

    const stats = [];
    return (
      <div className="dashboard-testBox">
        {this.state.modalList}
        <div className="testBox-top">
          <span className="testBox-testName">
            {test.testName}
          </span>
          <span>
            <div>
              <button onClick={() => {
                  this.props.history.push({
                    pathname: 'view-test-details',
                    state: { testId: test.testId }
                  });
                  window.location.reload();
                }} type="button" className="secondaryButton button1">View Test Details
              </button>
              
              <button onClick={() => {
                  this.props.history.push({
                    pathname: 'view-test-results',
                    state: { testId: test.testId, testName: test.testName }
                  });
                  window.location.reload();
                }} type="button" className="secondaryButton button1">View Test Results
              </button>

              <span style={{marginTop: "7px"}}>
                {this.generateOptionsDropdown(test, this.state.selectedOption)}
              </span>
            </div>
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
              <span className="testStat-label">Reference Code:</span>{test.referenceCode}
              {CreateInfoButton("reference", this.showInfoModal.bind(this))}
            </div>

            <div>
              <span className="testStat-label">Launched:</span>{test.launchedDate}
            </div>
          </span>
          <span className="testBox-bottom-right">
            {this.renderStats()}
          </span>
          <div>
            <span className="testStat-label">Status:</span>{test.testStatus}
            {CreateInfoButton("status", this.showInfoModal.bind(this))}
          </div>
        </div>
      </div>
    );
  }
}

export default TestContainer;
