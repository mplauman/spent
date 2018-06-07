import React from 'react';
import PropTypes from 'prop-types';

class ExpenseInstance extends React.Component {
  render() {
    return (
      <div className='expenseInstance'>
        <div className='expenseDate'>{this.props.date}</div>
        <div className='expenseValue'>{this.props.value}</div>
        <div className='expenseName'>{this.props.name}</div>
      </div>
    );
  }
}

ExpenseInstance.propTypes = {
  date: PropTypes.string.isRequired,
  value: PropTypes.number.isRequired,
  name: PropTypes.string.isRequired
};

export default ExpenseInstance;
