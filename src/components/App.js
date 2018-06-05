import React from 'react';

import MenuBar from './MenuBar';

class App extends React.Component {
  render() {
    return (
      <div>
        <MenuBar />

        <div className="App">
          <div>stuff goes here</div>
        </div>
      </div>
    );
  }
}

export default App;
