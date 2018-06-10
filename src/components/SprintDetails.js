import React from 'react';
import PropTypes from 'prop-types';

import InvoiceList from './InvoiceList';

class SprintDetails extends React.Component {
  render() {
    return (
      <div>
        <div><strong>Opening Balance:</strong> {this.props.openingBalance}</div>

        <InvoiceList invoices={this.props.invoices} />

        <div><strong>Projected Closing:</strong> {this.props.closingBalance}</div>
        <div><strong>Revised Closing:</strong> {this.props.revisedClosing}</div>
      </div>
    );
  }
}

SprintDetails.propTypes = {
  startDate: PropTypes.string.isRequired,
  invoices: PropTypes.array.isRequired,
  openingBalance: PropTypes.number.isRequired,
  closingBalance: PropTypes.number.isRequired,
  revisedClosing: PropTypes.number.isRequired
};

export default SprintDetails;
