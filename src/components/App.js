import React from 'react';
import axios from 'axios';

import AddExpense from './AddExpense';
import AddIncome from './AddIncome';
import AddSprint from './AddSprint';
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

const Dialogs = Object.freeze({
  none: {},
  addSprint: {},
  addExpense: {},
  addIncome: {}
});

class App extends React.Component {

  logIn = () => {
    console.info('logging in');

    let current = axios
      .get('/api/sprints/current')
      .then(resp => resp.data);

    let projections = axios
      .get('/api/sprints/projections')
      .then(resp => resp.data);

    Promise
      .all([current, projections])
      .then(results => {
        this.setState({
          loggedIn: true,
          currentSprint: results[0],
          projectedSprints: results[1]
        });
      })
      .catch(console.error);
  }

  logOut = () => {
    console.info('logging out');
    this.setState({
      loggedIn: false,
      currentSprint: null,
      projectedSprints: null
    });
  }

  setView = (view) => {
    this.setState({
      view
    });
  }

  setDialog = (dialog) => {
    this.setState({
      dialog
    });
  }

  state = {
    view: Views.dashboard,
    dialog: Dialogs.none,
    loggedIn: false,
    currentSprint: null,
    projectedSprints: null
  };

  render() {
    let view = null;
    switch (this.state.view) {
    case Views.dashboard:
      view = (
        <Dashboard
          loggedIn={this.state.loggedIn}
          currentSprint={this.state.currentSprint}
          projectedSprints={this.state.projectedSprints}
        />
      );
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

    let dialog = null;
    switch (this.state.dialog) {
    case Dialogs.addSprint:
      dialog = (
        <AddSprint
          onStart={() => this.setDialog(Dialogs.none)}
          onCancel={() => this.setDialog(Dialogs.none)}
          currentSprint={this.state.currentSprint}
        />
      );
      break;

    case Dialogs.addExpense:
      dialog = (
        <AddExpense
          onStart={() => this.setDialog(Dialogs.none)}
          onCancel={() => this.setDialog(Dialogs.none)}
        />
      );
      break;

    case Dialogs.addIncome:
      dialog = (
        <AddIncome
          onStart={() => this.setDialog(Dialogs.none)}
          onCancel={() => this.setDialog(Dialogs.none)}
        />
      );
      break;

    case Dialogs.none:
      dialog = null;
      break;

    default:
      throw 'unexpected dialog ' + this.state.dialog;
    }

    return (
      <div>
        <MenuBar
          loggedIn={this.state.loggedIn}
          startSprint={() => this.setDialog(Dialogs.addSprint)}
          addExpense={() => this.setDialog(Dialogs.addExpense)}
          addIncome={() => this.setDialog(Dialogs.addIncome)}
          logIn={this.logIn}
          logOut={this.logOut}
          viewDashboard={() => this.setView(Views.dashboard)}
          viewSprints={() => this.setView(Views.sprints)}
          viewExpenses={() => this.setView(Views.expenses)}
          viewSettings={() => this.setView(Views.settings)}
        />
        {dialog}
        {view}
      </div>
    );
  }
}

export default App;
