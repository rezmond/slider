import React, { Component } from 'react';

import logo from './logo.svg';
import './App.css';
import { Slider } from './components/Slider/index.jsx'


export default class App extends Component {
  render() {
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h1 className="App-title">My slider</h1>
        </header>
        <div className="App-intro">
          <Slider url="example.com" />
        </div>
      </div>
    );
  }
}