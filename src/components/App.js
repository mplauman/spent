import React from 'react';

import Dashboard from './Dashboard';
import Expenses from './Expenses';
import MenuBar from './MenuBar';
import Settings from './Settings';
import Sprints from './Sprints';

const Views = Object.freeze({
  dashboard: {},
  expenses: {},
  settings: {},
  sprints: {}
});

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

  setView = (view) => {
    this.setState({
      view
    });
  }

  state = {
    view: Views.dashboard,
    loggedIn: false
  };

  render() {
    let view = null;
    switch (this.state.view) {
    case Views.dashboard:
      view = (<Dashboard loggedIn={this.state.loggedIn}/>);
      break;

    case Views.expenses:
      view = (<Expenses/>);
      break;

    case Views.settings:
      view = (<Settings/>);
      break;

    case Views.sprints:
      view = (<Sprints/>);
      break;

    default:
      throw 'unexpected view ' + this.state.view;
    }

    return (
      <div>
        <MenuBar
          loggedIn={this.state.loggedIn}
          startSprint={this.startSprint}
          addExpense={this.addExpense}
          addIncome={this.addIncome}
          logIn={this.logIn}
          logOut={this.logOut}
          viewDashboard={() => this.setView(Views.dashboard)}
          viewSprints={() => this.setView(Views.sprints)}
          viewExpenses={() => this.setView(Views.expenses)}
          viewSettings={() => this.setView(Views.settings)}
        />

        {view}
      </div>
    );
  }
}

export default App;
