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

  viewDashboard = () => {
    console.info('home clicked');
  }

  viewSprints = () => {
    console.info('view sprints');
  }

  viewExpenses = () => {
    console.info('view expenses');
  }

  viewSettings = () => {
    console.info('view settings');
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
          viewDashboard={this.viewDashboard}
          viewSprints={this.viewSprints}
          viewExpenses={this.viewExpenses}
          viewSettings={this.viewSettings}
        />

        {this.state.child}

      </div>
    );
  }
}

export default App;
