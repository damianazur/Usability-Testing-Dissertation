import React from 'react';

export const Form = ({ onSubmit }) => {
  return (
    <form onSubmit={e => e.preventDefault()}>
      <div className="form-group">
        <label htmlFor="name">Project Name</label>
        <input className="form-control" id="name" />
      </div>
      <div className="form-group">
        <button onClick={onSubmit} className="form-control btn btn-primary">
          Submit
        </button>
      </div>
    </form>
  );
};
export default Form;
