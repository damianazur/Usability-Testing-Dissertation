import React, { Component } from "react";

import { Helmet } from "react-helmet";

export default class Home extends Component {
  constructor(props) {
    super(props);

    this.state = {
      content: ""
    };
  }

  componentDidMount() {
  }

  render() {
    return (
      <div className="mainDiv" style={{ backgroundImage: "url(/Background.jpg)" }}>
        <Helmet>
          <style>{'body { background-color: rgb(27, 27, 27); }'}</style>
        </Helmet>

        <div id="headingDiv">
          <h1 id="mainText">UsabCheck</h1>
          <h1 id="otherText">Test the usability of software with emotion recognition technology</h1>
        </div>
      </div>
    );
  }
}