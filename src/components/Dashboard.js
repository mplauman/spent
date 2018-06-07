import React from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';
import {Jumbotron, Well} from 'react-bootstrap';

import SprintDetails from './SprintDetails';
import SprintSummaryList from './SprintSummaryList';

class Dashboard extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      currentSprint: null,
      projectedSprints: null
    };
  }

  componentDidMount() {
    this.loadData();
  }

  componentDidUpdate() {
    this.loadData();
  }

  loadData = () => {
    if (!this.props.loggedIn) {
      console.info('not logged in, skipping API calls');

      if (this.state.currentSprint || this.state.projectedSprints) {
        console.info('clearing out current state');
        this.setState({
          currentSprint: null,
          projectedSprints: null
        });
      }

      return;
    }

    if (!this.state.currentSprint || !this.state.projectedSprints) {
      console.info('fetching data');

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
            currentSprint: results[0],
            projectedSprints: results[1]
          });
        })
        .catch(console.error);
    }
  }

  render() {
    if (!this.props.loggedIn) {
      return (
        <Jumbotron>
          <h2>Life comes at you fast</h2>
          <p>
            Spent is a simple way to budget your expenses. Instead of tracking
            every nickel and dime, Spent provides an estimate of how much cash
            you&#39;ll have available by the next time you get paid.
          </p>
          <p>
            Every time you get paid, you simply start another pay period using
            your current balance. You won&#39;t be penalized for straying from
            the path or not recording every transaction.
          </p>
          <p>
            Spent is here to help. When you want. How you want.
          </p>
        </Jumbotron>
      );
    }

    if (!this.state.currentSprint) {
      return (
        <Jumbotron>
          <h2>You&#39;re almost started!</h2>
          <p>
            It doesn&#39;t look like you have started a sprint yet. Click
            on <b>Go</b> to add income, expenses, and to start a new sprint.
          </p>
        </Jumbotron>
      );
    }

    return (
      <Well>
        <SprintDetails {...this.state.currentSprint} />
        <SprintSummaryList sprints={this.state.projections} />
      </Well>
    );
  }
}
Dashboard.propTypes = {
  loggedIn: PropTypes.bool.isRequired
};

export default Dashboard;
