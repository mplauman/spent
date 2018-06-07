import React from 'react';
import PropTypes from 'prop-types';

import ExpenseInstanceList from './ExpenseInstanceList';

class SprintDetails extends React.Component {
  render() {
    return (
      <div className='sprintDetails'>
        <div>Opening Balance: {this.props.openingBalance}</div>
        <ExpenseInstanceList expenses={this.props.expenses} />
        <div>Projected Closing: {this.props.closingBalance}</div>
        <div>Revised Closing: {this.props.revisedClosing}</div>
      </div>
    );
  }
}

SprintDetails.propTypes = {
  id: PropTypes.string.isRequired,
  expenses: PropTypes.array.isRequired,
  openingBalance: PropTypes.number.isRequired,
  closingBalance: PropTypes.number.isRequired,
  revisedClosing: PropTypes.number.isRequired
};

export default SprintDetails;
