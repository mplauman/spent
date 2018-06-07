import React from 'react';
import PropTypes from 'prop-types';

class SprintDetails extends React.Component {
  render() {
    return (
      <div>this.props.id</div>
    );
  }
}

SprintDetails.props = {
  id: PropTypes.string.isRequired,
  expenses: PropTypes.array.isRequired,
};

export default SprintDetails;
