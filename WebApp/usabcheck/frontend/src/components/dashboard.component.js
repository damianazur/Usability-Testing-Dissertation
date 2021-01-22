import React, { Component } from "react";
import { Dropdown } from 'react-bootstrap';
import Popup from 'reactjs-popup';

import Server from "components/server.component";
import Modal from "modal/modalTemplate";
import ModalContainer from "components/modalContainer.component";

import "bootstrap.min.css";

export default class Login extends Component {
  constructor(props) {
    super(props);

    this.state = {
      projects: undefined,
      myvar: undefined,
      selectedProject: "Choose Project"
    };

    console.log("State: " + this.state);
  }

  async componentDidMount() {
    const user = JSON.parse(localStorage.getItem('user'));

    Server.getProjectList(user.accessToken).then(response => {
      this.setState({projects: response.data});
    });
  }
  
  renderLoadingState = () => (
    <div className="post-loading">
      Loading...
    </div>
  )

  sampleMethod() {
    console.log("Hello!");
  }

  onSelect(projectName) {
    console.log("Clicked#", projectName);

    console.log(this);

    // let state = this.state;
    // state.selectedProject = projectName;
    this.setState({selectedProject: projectName});
  }

  renderPosts = () => {
    let projects = this.state.projects;

    let self = this;

    console.log(self);

    let params = {}
    params.self = self;

    let dropDownName = "Projects";
    let menuItems = [];

    for(let i = 0; i < projects.length; i++) {
      console.log("Project: ", projects[i].projectName);
      let item = projects[i];
      params.projectName = item.projectName;

      menuItems.push(
        <Dropdown.Item  as="button" key={i} onSelect={this.onSelect.bind(this)} eventKey={item.projectName}>{item.projectName}</Dropdown.Item>
      );
    }

    return (
    <Dropdown>
      <Dropdown.Toggle variant="success" id="dropdown-basic">
        {this.state.selectedProject}
      </Dropdown.Toggle>

      <Dropdown.Menu>
        {menuItems}
      </Dropdown.Menu>
    </Dropdown>
    )
  }

  createProjectSubmit() {
    console.log("Project submit!");
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
                <h2>There are projects </h2>

                {this.renderPosts()}
                <ModalContainer triggerText={"Create Project"} onSubmit={this.createProjectSubmit}/>
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