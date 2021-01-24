import React, { Component } from "react";

import { CreateProjectForm } from 'forms/createProjectForm';
import { DeleteProjectForm } from 'forms/deleteProjectForm';
import Server from "services/server.service";
import ModalContainer from "components/modalContainer.component";
import TestContainer from "components/testContainer.component";
import DropdownGenerator from "components/dropdownGenerator.component";

import "bootstrap.min.css";

export default class CreateTest extends Component {
  constructor(props) {
    super(props);

    this.state = {
      
    };
  }

  update() {

  }

  async componentDidMount() {
  }
  
  renderLoadingState = () => (
    <div className="post-loading">
      Loading...
    </div>
  )

  

  render() {  
    console.log("RENDER", this.state);

    return (
      <div className="mainPageDiv">
        <h1>Create Usability Test</h1>
        <hr></hr>
        <div className="createTest-content">  
        
        </div>
      </div>
    )
  }
}