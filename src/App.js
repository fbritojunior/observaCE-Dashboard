import React, { Component } from 'react';
import Dashboard from './components/Dashboard'
import './css/App.css'

let data_ = require('./data/ce-municipalities_topo.json');

class App extends Component {

  render() {
    return ( 
      <Dashboard data = {data_} /> 
    );
  }
}

export default App;
