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

  logIn = () => {
    console.info('logging in');
    this.setState({
      loggedIn: true
    });
  }

  logOut = () => {
    console.info('logging out');
    this.setState({
      loggedIn: false
    });
  }

  state = {
    child: <DefaultState onStateClick={this.switchToNewState} />,
    loggedIn: false
  };

  render() {
    return (
      <div>
        <MenuBar
          loggedIn={this.state.loggedIn}
          startSprint={this.startSprint}
          addExpense={this.addExpense}
          addIncome={this.addIncome}
          logIn={this.logIn}
          logOut={this.logOut}
        />

        {this.state.child}

      </div>
    );
  }
}

export default App;
