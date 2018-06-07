import React from 'react';
import PropTypes from 'prop-types';

class SprintSummary extends React.Component {
  render() {
    return (
      <tr>
        <td width='10%'>{this.props.endDate}</td>
        <td width='90%'>{this.props.closingBalance}</td>
      </tr>
    );
  }
}

SprintSummary.propTypes = {
  endDate: PropTypes.string.isRequired,
  closingBalance: PropTypes.number.isRequired
};

export default SprintSummary;
