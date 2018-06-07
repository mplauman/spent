import React from 'react';
import PropTypes from 'prop-types';
//import axios from 'axios';
import {Jumbotron, Well} from 'react-bootstrap';

import SprintDetails from './SprintDetails';
import SprintSummaryList from './SprintSummaryList';

class Dashboard extends React.Component {
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

    if (!this.props.currentSprint) {
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
      <div>
        <Well>
          <h1>Current Sprint <small>{this.props.currentSprint.startDate} - {this.props.currentSprint.endDate}</small></h1>
          <SprintDetails {...this.props.currentSprint} />
        </Well>
        <Well>
          <h1>Upcoming Sprints</h1>
          <SprintSummaryList sprints={this.props.projectedSprints} />
        </Well>
      </div>
    );
  }
}
Dashboard.propTypes = {
  loggedIn: PropTypes.bool.isRequired,
  currentSprint: PropTypes.object,
  projectedSprints: PropTypes.array
};

export default Dashboard;
