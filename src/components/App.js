import React from 'react';

import Dashboard from './Dashboard';
import Expenses from './Expenses';
import MenuBar from './MenuBar';
import Settings from './Settings';
import Sprints from './Sprints';

class App extends React.Component {

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
    this.setState({
      child: <Dashboard />
    });
  }

  viewSprints = () => {
    this.setState({
      child: <Sprints />
    });
  }

  viewExpenses = () => {
    this.setState({
      child: <Expenses />
    });
  }

  viewSettings = () => {
    this.setState({
      child: <Settings />
    });
  }

  state = {
    child: <Dashboard />,
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
