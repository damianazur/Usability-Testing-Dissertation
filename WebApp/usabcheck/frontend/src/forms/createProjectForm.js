import React from 'react';
import { CreateInfoModals, CreateInfoButton } from 'modal/infoModalUtilities'; 
import { ProjectInfoForm } from 'forms/infoForms';

export const CreateProjectForm = ({ onSubmit }) => {
  var nameFormPair = {
    "projectInfo": ProjectInfoForm
  }
  var returnData = CreateInfoModals(nameFormPair);
  var modalList =  returnData.modalList;
  var infoRefPair =  returnData.infoRefPair;

  function showInfoModal(modalName) {
    var ref = infoRefPair[modalName];
    ref.current.showModal();
  }

  return (
    <form onSubmit={onSubmit}>
      <div>
        {modalList}
      </div>

      <div className="form-group">
        <label className="fullWidth">Project Name {CreateInfoButton("projectInfo", showInfoModal)}</label>
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
