import React from 'react';
import PropTypes from 'prop-types';

class ExpenseInstance extends React.Component {
  render() {
    return (
      <tr>
        <td width='10%'>{this.props.date}</td>
        <td width='10%'>{this.props.value}</td>
        <td width='80%'>{this.props.name}</td>
      </tr>
    );
  }
}

ExpenseInstance.propTypes = {
  date: PropTypes.string.isRequired,
  value: PropTypes.number.isRequired,
  name: PropTypes.string.isRequired
};

export default ExpenseInstance;
