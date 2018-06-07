import React from 'react';
import PropTypes from 'prop-types';

import ExpenseInstance from './ExpenseInstance';

class ExpenseInstanceList extends React.Component {
  render() {
    return (
      <div className='expenseList'>
        {this.props.expenses
          .sort((lhs, rhs) => {
            if (lhs.date < rhs.date) {
              return -1;
            }
            if (lhs.date > rhs.date) {
              return 1;
            }
            return 0;
          })
          .map(expense =>
            <ExpenseInstance key={expense.name + expense.date} {...expense} />
          )}
      </div>
    );
  }
}

ExpenseInstanceList.propTypes = {
  expenses: PropTypes.array.isRequired
};

export default ExpenseInstanceList;
