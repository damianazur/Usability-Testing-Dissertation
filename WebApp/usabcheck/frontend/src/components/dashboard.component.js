import React, { Component } from "react";
import { Dropdown } from 'react-bootstrap';

import Server from "components/server.component";
import ModalContainer from "components/modalContainer.component";

import "bootstrap.min.css";

export default class Login extends Component {
  constructor(props) {
    super(props);

    // Popup for creating a project
    this._createProjectModal = React.createRef();

    this.state = {
      projects: undefined,
      tests: undefined,
      selectedProject: "Choose Project"
    };
  }

  async componentDidMount() {
    this.updateProjectList();
  }

  updateProjectList() {
    Server.getProjectList().then(response => {
      this.setState({projects: response.data});
    });
  }

  updateTestList(projectId) {
    Server.getTestList(projectId).then(response => {
      console.log(response.data);
      this.setState({tests: response.data});
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

    this.updateTestList(params.projectId);
    this.setState({selectedProject: projectName});
  }

  renderPostsDropDown = () => {
    let projects = this.state.projects;
    let menuItems = [];

    for(let i = 0; i < projects.length; i++) {
      // console.log("Project: ", projects[i]);
      let item = projects[i];

      let params = JSON.stringify({
        projectName: item.projectName,
        projectId: item.projectId
      });

      menuItems.push(
        <Dropdown.Item  as="button" key={i} onSelect={this.onProjectSelect.bind(this)} eventKey={params}>{item.projectName}</Dropdown.Item>
      );
    }

    return (
    <Dropdown>
      <Dropdown.Toggle className="dropDownButton" variant="success" id="dropdown-basic">
        {this.state.selectedProject}
      </Dropdown.Toggle>

      <Dropdown.Menu>
        {menuItems}
      </Dropdown.Menu>
    </Dropdown>
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

  displayTests() {
    // let tests = this.state.test;
    // let menuItems = [];

    // for(let i = 0; i < projects.length; i++) {
    //   console.log("Project: ", projects[i].projectName);
    //   let item = projects[i];
    //   params.projectName = item.projectName;

    //   menuItems.push(
    //     <Dropdown.Item  as="button" key={i} onSelect={this.onProjectSelect.bind(this)} eventKey={item.projectName}>{item.projectName}</Dropdown.Item>
    //   );
    // }

    // return (
    // <Dropdown>
    //   <Dropdown.Toggle className="dropDownButton" variant="success" id="dropdown-basic">
    //     {this.state.selectedProject}
    //   </Dropdown.Toggle>

    //   <Dropdown.Menu>
    //     {menuItems}
    //   </Dropdown.Menu>
    // </Dropdown>
    // )
  }

  render() {  

    console.log("RENDER", this.state);

    const projects = this.state.projects;

    if (projects) {
      return (
        <div>
          <h1>Projects</h1>
          <div className="post-content">     
            {this.state.projects.length > 0 ? (
              <div>
                {this.renderPostsDropDown()}
                <ModalContainer ref={this._createProjectModal} triggerText={"Create Project"} onSubmit={this.createProjectSubmit.bind(this)}/>

                <div>
                  <h2>Usability Tests</h2>
                  <button onClick={() => {
                      this.props.history.push("/create-test");
                      window.location.reload();
                    }} type="button">Create Usability Test
                  </button>
                </div>

                {this.state.selectedProject ? (
                  <div>
                    
                  </div>
                ):(
                  <h2>You have no tests created</h2>
                )}

              </div>       
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