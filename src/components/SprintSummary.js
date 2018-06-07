import React from 'react';
import PropTypes from 'prop-types';

class SprintSummary extends React.Component {
  render() {
    return (
      <div>
        <div>{this.props.id}</div>
        <div>{this.props.closingBalance}</div>
      </div>
    );
  }
}

SprintSummary.propTypes = {
  id: PropTypes.string.isRequired,
  closingBalance: PropTypes.number.isRequired
};

export default SprintSummary;
