import React from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';

import AddInvoice from './AddInvoice';
import AddSprint from './AddSprint';
import Dashboard from './Dashboard';
import Invoices from './Invoices';
import LogInDialog from './LogInDialog';
import MenuBar from './MenuBar';
import Settings from './Settings';
import Sprints from './Sprints';


const Views = Object.freeze({
  dashboard: {},
  invoices: {},
  settings: {},
  sprints: {}
});

const Dialogs = Object.freeze({
  none: {},
  addSprint: {},
  addExpense: {},
  addIncome: {},
  logIn: {}
});

class App extends React.Component {

  loggedIn = (credentials) => {
    const config = {
      headers: {
        Authorization: credentials.provider + ' ' + credentials.token
      }
    };

    let current = axios
      .get('/api/sprints/current', config)
      .then(resp => resp.data);

    let projections = axios
      .get('/api/sprints/projections', config)
      .then(resp => resp.data);

    Promise
      .all([current, projections])
      .then(results => {
        this.setState({
          loggedIn: true,
          currentSprint: results[0] ? results[0] : null,
          projectedSprints: results[1],
          dialog: Dialogs.none
        });
      })
      .catch(console.error);
  }

  logOut = () => {
    console.info('logging out');
    this.setState({
      loggedIn: false,
      currentSprint: null,
      projectedSprints: null,
      view: Views.dashboard,
      dialog: Dialogs.none
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

  startSprint = (prototype) => {
    this.setState({
      dialog: Dialogs.none
    });

    axios
      .post('/api/sprints/current', prototype)
      .then(resp => {
        this.setState({
          currentSprint: resp.data
        });

        return axios.get('/api/sprints/projections');
      })
      .then(resp => {
        this.setState({
          projectedSprints: resp.data
        });
      })
      .catch(console.error);
  }

  addInvoices = (prototype, addMore) => {
    if (!addMore) {
      this.setState({
        dialog: Dialogs.none
      });
    }

    axios
      .post('/api/invoices', [ prototype ])
      .then(() => {
        const current = axios.get('/api/sprints/current');
        const projections = axios.get('/api/sprints/projections');

        return Promise.all([current, projections]);
      })
      .then(results => {
        this.setState({
          currentSprint: results[0].data ? results[0].data : null,
          projectedSprints: results[1].data
        });
      })
      .catch(console.error);
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

    case Views.invoices:
      view = (<Invoices/>);
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
          onStart={this.startSprint}
          onCancel={() => this.setDialog(Dialogs.none)}
          currentSprint={this.state.currentSprint}
        />
      );
      break;

    case Dialogs.addExpense:
      dialog = (
        <AddInvoice
          title='New Expense'
          isIncome={false}
          onAdd={this.addInvoices}
          onCancel={() => this.setDialog(Dialogs.none)}
        />
      );
      break;

    case Dialogs.addIncome:
      dialog = (
        <AddInvoice
          title='New Income'
          isIncome={true}
          onAdd={this.addInvoices}
          onCancel={() => this.setDialog(Dialogs.none)}
        />
      );
      break;

    case Dialogs.none:
      dialog = null;
      break;

    case Dialogs.logIn:
      dialog = (
        <LogInDialog
          onSuccess={this.loggedIn}
          onCancel={() => this.setDialog(Dialogs.none)}
          googleAppId={this.props.googleAppId}
          linkedinAppId={this.props.linkedinAppId}
        />
      );
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
          logIn={() => this.setDialog(Dialogs.logIn)}
          logOut={this.logOut}
          viewDashboard={() => this.setView(Views.dashboard)}
          viewSprints={() => this.setView(Views.sprints)}
          viewInvoices={() => this.setView(Views.invoices)}
          viewSettings={() => this.setView(Views.settings)}
        />

        {dialog}
        {view}
      </div>
    );
  }
}
App.propTypes = {
  googleAppId: PropTypes.string.isRequired,
  linkedinAppId: PropTypes.string.isRequired
};

export default App;
