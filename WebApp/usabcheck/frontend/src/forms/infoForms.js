import React from 'react';

export const UsabTestInfoForm = ({ onSubmit }) => {
  return (
    <form>
      <div className="form-group">
        <label className="fullWidth">Create Test Information</label>
        <p>
          A usability test is a series of tasks and questions that will be presented to the user
          in chronological order.
        </p>
        <p>An an example, the sequence of a usability test could look like:<br></br><i>Question, Task, Task, Task, Question</i></p>
        <p>The number of tasks and questions is entirely up to your needs and requirements.</p>
        <p>
          Additionally, the recording of the user completing the test, and their facial expressions will be recorded.
        </p>
      </div>
    </form>
  );
};


export const PreTestInfoForm = ({ onSubmit }) => {
  return (
    <form>
      <div className="form-group">
        <label className="fullWidth">Pre-Test Information</label>
        <p>
          The pre-test questions can be used to get more information about the participant and
          their skills level.
        </p>
        <p>
          For example, <i>How often do you shop online?</i>
        </p>
      </div>
    </form>
  );
};


export const TaskInfoForm = ({ onSubmit }) => {
  return (
    <form>
      <div className="form-group">
        <label className="fullWidth">Task Information</label>
        <p>
          A task is what you want the participant to do. The task name is the title of the task.
        </p>
        <p>
          For example, <i>Select Product</i>
        </p>
        
        <p>
          The steps/instructions will be given to the user and they can be as specific as you need them to be.
        </p>
        <p>
          For example, <br></br>
          <i>1. Navigate to the "Select Products page"</i><br></br>
          <i>2. Filter the products by price in ascending order (high to low)"</i><br></br>
          <i>3. View the product details"</i><br></br>
          etc.
        </p>
      </div>
    </form>
  );
};


export const TestNameInfoForm = ({ onSubmit }) => {
  return (
    <form>
      <div className="form-group">
        <label className="fullWidth">Test Name Information</label>
        <p>
          The name of the test should be unique and descriptive of what is being tested.
        </p>
        <p>
          For example, <i>Product Purchasing</i>
        </p>
      </div>
    </form>
  );
};

export const TextQuestionInfoForm = ({ onSubmit }) => {
  return (
    <form>
      <div className="form-group">
        <label className="fullWidth">Text Question Information</label>
        <p>
          A question will be presented to the participant as text and the answer the participant will give will also be written in text.<br></br>
        </p>
        <p>
          A text answer is best for open ended questions.
        </p>
        <p>
          For example, <i>Do you have any feedback for us?</i>
        </p>
      </div>
    </form>
  );
};

export const MultipleChoiceQuestionInfoForm = ({ onSubmit }) => {
  return (
    <form>
      <div className="form-group">
        <label className="fullWidth">Multiple-Choice Question Information</label>
        <p>
          The question will be presented to the user and they will pick <u>one</u> answer.<br></br>
        </p>
        <p>
          You can set as many options as you need.
        </p>
        <p>
          For example, <br></br><i>How would you rate the difficulty of the task?</i><br></br><br></br>
          <i>Very Easy</i> <br></br>
          <i>Easy</i> <br></br>
          <i>Morderate</i> <br></br>
          <i>Difficult</i> <br></br>
          <i>Very Difficult</i> <br></br>
        </p>
      </div>
    </form>
  );
};

export const ProjectInfoForm = ({ onSubmit }) => {
  return (
    <form>
      <div className="form-group">
        <label className="fullWidth">Project Information</label>
        <p>
          A project may represent an application that will be tested. Within a project there is going to be tests, with each test
          testing an area of the application.
        </p>
        <p>
          For example, the name of a project could be: <i>Your App Name</i>
        </p>
      </div>
    </form>
  );
};

export const StatusInfoForm = ({ onSubmit }) => {
  return (
    <form>
      <div className="form-group">
        <label className="fullWidth">Status Information</label>
        <p>
          The status determines whether or not usability tests can be conducted.<br></br>
          If it is closed then a participant cannot start an usability test. A closed test can be reopened.
        </p>
      </div>
    </form>
  );
};

export const ReferenceNumInfoForm = ({ onSubmit }) => {
  return (
    <form>
      <div className="form-group">
        <label className="fullWidth">Reference Number Information</label>
        <p>
          A reference number is entered into the application the participant is using.<br></br><br></br>
          The application will then use the code to identify the usability test and retrieve the necessary data to conduct the usability study.
        </p>
      </div>
    </form>
  );
};


export const EntireVideoTimelineInfoForm = ({ onSubmit }) => {
  return (
    <form>
      <div className="form-group">
        <label className="fullWidth">Entire Video Bar Information</label>
        <p>
          The "emotions" bar shows where emotions occur on the <u>entire</u> video. 
        </p>
        <p>
          The "tasks" bar shows where tasks and questions occur on the <u>entire</u> video. 
        </p>
        <p>
          Click on the colours in the bar to jump to the time in the video.
        </p>
        <p>
          <u>Note:</u> The length of the bars are consistent with the length of the bar in the video.
        </p>
        <p>

        </p>
      </div>
    </form>
  );
};


export const ZoomedInTimelineInfoForm = ({ onSubmit }) => {
  return (
    <form>
      <div className="form-group">
        <label className="fullWidth">Zoomed-in Video Bar Information</label>
        <p>
          The zoomed in emotion bar is used to zoom in on the "entire" emotion bar above.
        </p>
        <p>
          Use the horizontal scroll bar to move the slider.
        </p>
      </div>
    </form>
  );
};

export const TaskGradingInfoForm = ({ onSubmit }) => {
  return (
    <form>
      <div className="form-group">
        <label className="fullWidth">Task Grading Information</label>
        <p>
         
        </p>
      </div>
    </form>
  );
};

export const ScenarioInfoForm = ({ onSubmit }) => {
  return (
    <form>
      <div className="form-group">
        <label className="fullWidth">Scenario Information</label>
        <p>
          Before the user begins the test, scenario and other information written in the text box will be displayed for them read.
        </p>
        <p>
          This is where you can tell the participant the relevant information they should know before they begin the test.
        </p>
        <p>
          For example, you could you tell them about the page they are starting on and you can give them the URL they should navigate to before they begin the test.
        </p>
      </div>
    </form>
  );
};