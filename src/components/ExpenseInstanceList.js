import React from 'react';
import PropTypes from 'prop-types';
import {Table} from 'react-bootstrap';

import ExpenseInstance from './ExpenseInstance';

class ExpenseInstanceList extends React.Component {
  render() {
    return (
      <Table striped bordered condensed hover>
        <tbody>
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
        </tbody>
      </Table>
    );
  }
}

ExpenseInstanceList.propTypes = {
  expenses: PropTypes.array.isRequired
};

export default ExpenseInstanceList;
