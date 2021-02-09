import React, { Component } from 'react';

export class TestResultOverviewTab extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isShown: false
    };
  }

  render() {
    return (
      <React.Fragment>
      {this.state.isShown ? (
        <div>
          Recording content goes here
        </div>
      ) : ( 
        null
      )}
    </React.Fragment>
    )
  }
}

export default TestResultOverviewTab;
