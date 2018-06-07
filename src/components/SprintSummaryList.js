import React, {Component} from 'react';
import PropTypes from 'prop-types';

class SprintSummaryList extends Component {
  render() {
    return (
      <div className='sprintSummaryList'>
        hello
      </div>
    );
  }
}

SprintSummaryList.props = {
  sprints: PropTypes.array.isRequired
};

export default SprintSummaryList;
