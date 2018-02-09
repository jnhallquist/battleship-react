import React, { Component } from 'react';
import Game from './Game';
import logo from './logo.svg';
import './App.css';

export default class App extends Component {
  render() {
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h1 className="App-title">Welcome to Battleship</h1>
        </header>
        <Game />
      </div>
    );
  }
}
