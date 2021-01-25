import React from 'react';

export const CreateProjectForm = ({ onSubmit }) => {
  return (
    <form onSubmit={onSubmit}>
      <div className="form-group">
        <label className="fullWidth">Project Name</label>
        <input autoComplete="off" className="inputField" id="projectName" type="text" name="projectName"/>
      </div>
      <div className="form-group">
        <button className="primaryButton centerElement">
          Submit
        </button>
      </div>
    </form>
  );
};
export default CreateProjectForm;
