import React from 'react';
import PropTypes from 'prop-types';

import SprintSummary from './SprintSummary';

class SprintSummaryList extends React.Component {
  render() {
    return (
      <div>
        {this.props.sprints
          .sort((lhs, rhs) => {
            if (lhs.id < rhs.id) {
              return -1;
            }
            if (lhs.id > rhs.id) {
              return 1;
            }
            return 0;
          })
          .map(sprint =>
            <SprintSummary key={sprint.id} {...sprint} />
          )}
      </div>
    );
  }
}

SprintSummaryList.propTypes = {
  sprints: PropTypes.array.isRequired
};

export default SprintSummaryList;
