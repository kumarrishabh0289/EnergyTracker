import React, { Component } from 'react';

import EnergyTracker from './components/EnergyTracker'
import './App.css';
import './bootstrap.css';

class App extends Component {
  render() {
    return (
      <div className="App">
        
        {/*<Counter/>*/}
        <EnergyTracker />
       
      </div>
    );
  }
}


export default App;