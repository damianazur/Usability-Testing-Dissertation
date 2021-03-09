import React, { Component, createRef } from "react";

import { CreateProjectForm } from 'forms/createProjectForm';
import { DeleteProjectForm } from 'forms/deleteProjectForm';
import Server from "services/server.service";
import ModalContainer from "components/modalContainer.component";
import TestContainer from "components/testContainer.component";
import DropdownGenerator from "components/dropdownGenerator.component";

import "bootstrap.min.css";

export default class Login extends Component {
  constructor(props) {
    super(props);

    // Popup for creating a project
    this._createProjectModal = React.createRef();
    this._deleteProjectModal = React.createRef();

    this.state = {
      projects: [],
      tests: [],
      selectedProject: {
        projectName: "Choose Project",
        projectId: undefined
      },
      testContainers: []
    };
  }

  update() {
    console.log("Dashboard rerender update");
    if (this.state.selectedProject.projectId !== undefined) {
      this.updateTestList(this.state.selectedProject.projectId);
    }
  }

  async componentDidMount() {
    console.log("DASHBOARD MOUNTED");
    var state = localStorage.getItem('dashboardExitState');

    this.updateProjectList();

    console.log(state)

    if (state) {
      state = JSON.parse(state);
      this.setState(state, this.postStateRestore);
    } 
  }

  postStateRestore() {
    console.log(this.state.selectedProject);
    if (this.state.selectedProject && this.state.selectedProject.projectId) {
      this.updateTestList(this.state.selectedProject.projectId)
    }
  }

  async componentWillUnmount() {
    localStorage.setItem('dashboardExitState', JSON.stringify(this.state));
  }

  updateProjectList() {
    Server.getProjectList().then(response => {
      this.setState({projects: response.data});
    });
  }

  updateTestList(projectId) {
    Server.getTestList(projectId).then(response => {
      console.log(response.data);
      this.setState({tests: response.data}, () => {
        // this.displayTests();
      });
    });
  }
  
  renderLoadingState = () => (
    <div className="post-loading">
      Loading...
    </div>
  )

  onProjectSelect(params) {
    params = JSON.parse(params);
    let projectName = params.projectName;

    console.log("Selected project: ", params)

    this.updateTestList(params.projectId);
    this.setState({selectedProject: {
      projectName: params.projectName,
      projectId: params.projectId
    }});
  }

  generateProjectDropdown = (onSelectFunction, selectedProjectState) => {
    let projects = this.state.projects;
    let menuItems = [];

    for(let i = 0; i < projects.length; i++) {
      let project = projects[i];
      let item = {};

      item.name = project.projectName;
      item.params = {
        projectName: project.projectName,
        projectId: project.projectId
      };
      item.onSelectFunction = onSelectFunction;

      menuItems.push(item);
    }

    return (
      <DropdownGenerator data={menuItems} initalText={selectedProjectState}></DropdownGenerator>
    )
  }

  createProjectSubmit(e) {
    e.preventDefault();
    let projectName = e.target.projectName.value

    console.log("Project submit!", e, projectName);

    this._createProjectModal.current.setState({isShown: false});
    Server.createProject(projectName).then(response => {
      console.log(response);
      this.updateProjectList();
    });
  }

  deleteProjectSubmit(e) {
    e.preventDefault();
    let projectId = e.target.deleteProjectId.value

    if (projectId === undefined || projectId === null || projectId === "") {
      return;
    }

    console.log("Project delete!", projectId);

    this._deleteProjectModal.current.setState({isShown: false});
    Server.deleteProject(projectId).then(response => {
      console.log(response);
      this.updateProjectList();
    });
  }

  deleteTestSubmit(e) {
    e.preventDefault();
    let testId = e.target.testId.value

    if (testId === undefined || testId === null || testId === "") {
      return;
    }

    console.log("Test delete!", testId);

    // this._deleteProjectModal.current.setState({isShown: false});
    // Server.deleteProject(projectId).then(response => {
    //   console.log(response);
    //   this.updateProjectList();
    // });
  }

  displayTests() {
    console.log(this.state.selectedProject);
    // console.log(this.state.tests);
    let tests = this.state.tests;

    if (!tests) {
      return(undefined);
    }

    var renderItems = [];
    // var key = this.state.containerKey;
    for(let i = 0; i < tests.length; i++) {
      let test = tests[i];

      console.log("Test: ", test.testName);

      var key = new Date().getTime() + i;
      renderItems.push(
        <TestContainer 
          key={key} 
          history={this.props.history} 
          parentUpdate={this.update.bind(this)} 
          onDelete={this.deleteTestSubmit.bind(this)} 
          testItem={test}>          
        </TestContainer>
      );
    }

    return (
      renderItems
    )
  }

  renderCreateTestButton() {
    return (
      <button onClick={() => {
        this.props.history.push({
          pathname: 'create-test',
          state: { projectId: this.state.selectedProject.projectId, projectName: this.state.selectedProject.projectName}
        });
        window.location.reload();
        }} type="button" className="secondaryButton button1">Create Usability Test
      </button>
    );
  }

  render() {  

    console.log("RENDER", this.state);
    console.log(this.state.testContainers)

    const projects = this.state.projects;

    if (projects) {
      return (
        <div className="mainPageDiv">
          <h1>Dashboard</h1>
          <hr></hr>
          <div className="post-content">  
            <ModalContainer 
              Form={CreateProjectForm} 
              ref={this._createProjectModal} 
              buttonClassName="secondaryButton button1" 
              triggerText={"Create a Project"} 
              onSubmit={this.createProjectSubmit.bind(this)}
            />   

            {this.state.projects.length > 0 ? (
              <span>
                {/* <label style={{marginRight: "15px"}}>Select Project:</label> */}
                {this.generateProjectDropdown(this.onProjectSelect.bind(this), this.state.selectedProject.projectName)}

                <ModalContainer 
                  Form={DeleteProjectForm} 
                  ref={this._deleteProjectModal} 
                  buttonClassName="secondaryButton deleteButton" 
                  triggerText={"Delete a Project"}
                  onSubmit={this.deleteProjectSubmit.bind(this)}
                  generateProjectDropdown={this.generateProjectDropdown.bind(this)}
                />

                {this.state.selectedProject.projectId && this.state.tests.length > 0 ? (
                  <span>
                    {this.renderCreateTestButton()}
                  </span>
                ) : (
                  null
                )}

                <div>
                    <div>
                      {this.state.selectedProject.projectId && (
                        <h2 style={{width: "100%"}}>Usability Tests</h2>
                      )}

                      {this.state.tests && this.state.tests.length > 0 ? (
                        <div>
                          <div className="testContainer">
                            {/* {this.state.testContainers} */}
                            {this.displayTests()}
                          </div>
                        </div>
                      ) : (
                        <h3>Please create a usability test for this project</h3>
                      )}

                      {this.state.selectedProject.projectId && this.state.tests.length == 0 ? (
                        <span>
                          {this.renderCreateTestButton()}
                        </span>
                      ) : (
                        null
                      )}
                    </div>
                 

                  {this.state.selectedProject ? (
                    <div>
                      
                    </div>
                  ):(
                    <h2>You have no tests created</h2>
                  )}
                </div>
              </span>       
             ) : (
              <h2>You have no projects created</h2>
            )}
          </div>
        </div>
      )
    } else {
      return this.renderLoadingState();
    }

  }
}