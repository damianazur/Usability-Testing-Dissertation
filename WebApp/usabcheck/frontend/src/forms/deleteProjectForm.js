import React, { Component } from 'react';

export class DeleteProjectForm extends Component {
  constructor(props) {
    super(props);

    this.state = {
      toDeleteProjectName: "Select Delete Project",
      toDeleteProjectId: ""
    };
  }

  onProjectSelect(params) {
    params = JSON.parse(params);
    let projectName = params.projectName;

    console.log("Selected delete project: ", params)

    this.setState({
      toDeleteProjectName: projectName,
      toDeleteProjectId: params.projectId
    });
  }

  render() {
    return (
      <form onSubmit={this.props.onSubmit}>
        <div className="form-group">
          <label style={{color: "red"}}>WARNING: This action cannot be undone!</label>
          <label>Select Project to Delete</label>
          <input type="hidden" name="deleteProjectName" value={this.state.toDeleteProjectName}></input>
          <input type="hidden" name="deleteProjectId" value={this.state.toDeleteProjectId}></input>
          {this.props.generateProjectDropdown(this.onProjectSelect.bind(this), this.state.toDeleteProjectName)}
        </div>
        <div className="form-group">
          <button className="primaryButton" style={{"backgroundColor": "red"}}>
            Delete Project
          </button>
        </div>
      </form>
    )
  }
}

export default DeleteProjectForm;
