import React from 'react';

import DefaultState from './DefaultState';
import MenuBar from './MenuBar';
import NewState from './NewState';

class App extends React.Component {
  switchToNewState = () => {
    this.setState({
      child: <NewState onStateClick={this.switchToDefaultState} />
    });
  }

  switchToDefaultState = () => {
    this.setState({
      child: <DefaultState onStateClick={this.switchToNewState} />
    });
  }

  state = {
    child: <DefaultState onStateClick={this.switchToNewState} />
  };

  render() {
    return (
      <div>
        <MenuBar />
        {this.state.child}
      </div>
    );
  }
}

export default App;
