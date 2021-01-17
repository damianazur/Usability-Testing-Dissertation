import React, {Component} from 'react';
import { Router, Route, browserHistory, IndexRoute } from "react-router";
import logo from './logo.svg';
import './App.css';

class App extends Component {
    state = {};
        componentDidMount() {
            this.displayMessage()
        }

      displayMessage = () => {
        fetch('/api/helloo')
            .then(response => response.text())
            .then(message => {
                this.setState({message: message});
            });
    };

    render() {
        return (
            <div className="App">
            <header className="App-header">
            <img src={logo} className="App-logo" alt="logo"/>
            <h3 className="App-title">{this.state.message}</h3>
            </header>
            <p className="App-intro">
            To get started, edit <code>src/App.js</code> and save to reload.
        </p>
        </div>
    );
    }
}

export default App;