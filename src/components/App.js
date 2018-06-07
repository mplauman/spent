import React from 'react';

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

  setDialog = (dialog) => {
    this.setState({
      dialog
    });
  }

  state = {
    view: Views.dashboard,
    dialog: null,
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

    let dialog = null;
    switch (this.state.dialog) {
    case Dialogs.addSprint:
      dialog = (
        <AddSprint
          onStart={() => this.setDialog(Dialogs.none)}
          onCancel={() => this.setDialog(Dialogs.none)}
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

    default:
      break;
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
