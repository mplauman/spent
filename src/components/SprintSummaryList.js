import React from 'react';
import PropTypes from 'prop-types';
import {Table} from 'react-bootstrap';

import SprintSummary from './SprintSummary';

class SprintSummaryList extends React.Component {
  render() {
    return (
      <Table striped bordered condensed hover>
        <thead>
          <tr>
            <th>End Date</th>
            <th>Closing Balance</th>
          </tr>
        </thead>
        <tbody>
          {this.props.sprints
            .sort((lhs, rhs) => {
              if (lhs.startDate < rhs.startDate) {
                return -1;
              }
              if (lhs.startDate > rhs.startDate) {
                return 1;
              }
              return 0;
            })
            .map(sprint =>
              <SprintSummary key={sprint.startDate} {...sprint} />
            )}
        </tbody>
      </Table>
    );
  }
}

SprintSummaryList.propTypes = {
  sprints: PropTypes.array.isRequired
};

export default SprintSummaryList;
