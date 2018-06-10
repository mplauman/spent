import React from 'react';
import PropTypes from 'prop-types';
import {Table} from 'react-bootstrap';

import Invoice from './Invoice';

class InvoiceList extends React.Component {
  render() {
    return (
      <Table striped bordered condensed hover>
        <tbody>
          {this.props.invoices
            .sort((lhs, rhs) => {
              if (lhs.date < rhs.date) {
                return -1;
              }
              if (lhs.date > rhs.date) {
                return 1;
              }
              return 0;
            })
            .map(invoice =>
              <Invoice key={invoice.name + invoice.date} {...invoice} />
            )}
        </tbody>
      </Table>
    );
  }
}

InvoiceList.propTypes = {
  invoices: PropTypes.array.isRequired
};

export default InvoiceList;
