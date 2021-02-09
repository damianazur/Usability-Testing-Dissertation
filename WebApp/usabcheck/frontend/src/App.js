import React, { Component } from "react";
import { Switch, Route, Link, BrowserRouter as Router} from "react-router-dom";

import "./App.css";

import AuthService from "services/auth.service";

import Login from "views/login.component";
import Register from "views/register.component";
import Home from "views/home.component";
import Dashboard from "views/dashboard.component";
import CreateTest from "views/createTest.component";
import ViewTestDetails from "views/viewTestDetails.component";
import ViewTestResults from "views/viewTestResults.component";

class App extends Component {
  constructor(props) {
    super(props);
    this.logOut = this.logOut.bind(this);

    this.state = {
      currentUser: undefined
    };
  }

  componentDidMount() {
    const user = AuthService.getCurrentUser();

    if (user) {
      this.setState({
        currentUser: user
      });
    }
  }

  logOut() {
    AuthService.logout();
  }

  render() {
    const { currentUser } = this.state;

    return (
      <Router>
      <div>
        <nav className="main-navbar">
          <div className="navbar-navDiv">
            <Link to={"/"} className="navDiv-link">
              UsabCheck
            </Link>
          </div>

          <div className="navbar-navDiv">
            {currentUser && (
              <li>
                <Link to={"/dashboard"} className="navDiv-link">
                  Dashboard
                </Link>
              </li>
            )}
          </div>

          {currentUser ? (
            <div className="navbar-navDiv">
              <li className="nav-right">
                <a href="/login" className="navDiv-link" onClick={this.logOut}>
                  LogOut
                </a>
              </li>
              <li className="nav-right">
                <Link to={"/dashboard"} className="navDiv-link">
                  {currentUser.username}
                </Link>
              </li>
            </div>
          ) : (
            <div className="navbar-navDiv">
              <li className="nav-right">
                <Link to={"/register"} className="navDiv-link">
                  Sign Up
                </Link>
              </li>

              <li className="nav-right">
                <Link to={"/login"} className="navDiv-link">
                  Login
                </Link>
              </li>
            </div>
          )}
        </nav>

        <Switch>
          <Route exact path="/" component={Home} />
          <Route exact path="/login" component={Login} />
          <Route exact path="/register" component={Register} />
          <Route exact path="/dashboard" component={Dashboard} />
          <Route exact path="/create-test" component={CreateTest} />
          <Route exact path="/view-test-details" component={ViewTestDetails} />
          <Route exact path="/view-test-results" component={ViewTestResults} />
        </Switch>
      </div>

      </Router>
    );
  }
}

export default App;