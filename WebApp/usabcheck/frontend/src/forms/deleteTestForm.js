import React from 'react';

export const DeleteTestForm = ({ onSubmit, details}) => {
  return (
    <form onSubmit={onSubmit}>
      <input type="hidden" name="deleteTestName" value={details.testName}></input>
      <input type="hidden" name="deleteTestId" value={details.testId}></input>

      <div className="form-group">
        <label style={{color: "red"}}>WARNING: This action cannot be undone!</label>
        <label>Details:</label>
        <div className="testStat">
          <span className="testStat-label">Project Name:</span>
          <span>{details.testName}</span>
        </div>
        <div className="testStat">
          <span className="testStat-label">Launched:</span>
          <span>{details.launchedDate}</span>
        </div>
      </div>
      <div className="form-group">
        <button className="primaryButton" style={{"backgroundColor": "red"}}>
          Delete Test
        </button>
      </div>
    </form>
  );
};
export default DeleteTestForm;
