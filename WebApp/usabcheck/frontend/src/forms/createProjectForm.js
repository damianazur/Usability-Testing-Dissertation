import React from 'react';

export const CreateProjectForm = ({ onSubmit }) => {
  return (
    <form onSubmit={onSubmit}>
      <div className="form-group">
        <label>Project Name</label>
        <input className="inputField" id="projectName" type="text" name="projectName"/>
      </div>
      <div className="form-group">
        <button className="primaryButton">
          Submit
        </button>
      </div>
    </form>
  );
};
export default CreateProjectForm;
