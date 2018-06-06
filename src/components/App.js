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

  startSprint = () => {
    console.info('start a new sprint');
  }

  addExpense = () => {
    console.info('add an expense');
  }

  addIncome = () => {
    console.info('add income');
  }

  state = {
    child: <DefaultState onStateClick={this.switchToNewState} />
  };

  render() {
    return (
      <div>
        <MenuBar
          startSprint={this.startSprint}
          addExpense={this.addExpense}
          addIncome={this.addIncome}
        />

        {this.state.child}
        
      </div>
    );
  }
}

export default App;
