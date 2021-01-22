import React, { Component } from "react";
import { Switch, Route, Link, BrowserRouter as Router} from "react-router-dom";

import "./App.css";

import AuthService from "./services/auth.service";

import Login from "./components/login.component";
import Register from "./components/register.component";
import Home from "./components/home.component";
import Dashboard from "./components/dashboard.component";

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
          <div className="navbar-nav">
            <Link to={"/"} className="nav-link">
              UsabCheck
            </Link>
          </div>

          <div className="navbar-nav">
            {currentUser && (
              <li>
                <Link to={"/dashboard"} className="nav-link">
                  Dashboard
                </Link>
              </li>
            )}
          </div>

          {currentUser ? (
            <div className="navbar-nav">
              <li className="nav-right">
                <a href="/login" className="nav-link" onClick={this.logOut}>
                  LogOut
                </a>
              </li>
              <li className="nav-right">
                <Link to={"/dashboard"} className="nav-link">
                  {currentUser.username}
                </Link>
              </li>
            </div>
          ) : (
            <div className="navbar-nav">
              <li className="nav-right">
                <Link to={"/register"} className="nav-link">
                  Sign Up
                </Link>
              </li>

              <li className="nav-right">
                <Link to={"/login"} className="nav-link">
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
        </Switch>
      </div>

      </Router>
    );
  }
}

export default App;