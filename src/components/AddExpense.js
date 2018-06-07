import React from 'react';
import PropTypes from 'prop-types';
import {Modal, Button} from 'react-bootstrap';

class AddExpense extends React.Component {
  render() {
    return (
      <Modal.Dialog>
        <Modal.Header>
          <Modal.Title>New Expense</Modal.Title>
        </Modal.Header>

        <Modal.Body>Input parameters for the new expense.</Modal.Body>

        <Modal.Footer>
          <Button onClick={this.props.onCancel}>Cancel</Button>
          <Button bsStyle='primary' onClick={this.props.onCancel}>Start</Button>
        </Modal.Footer>
      </Modal.Dialog>
    );
  }
}
AddExpense.propTypes = {
  onStart: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired
};

export default AddExpense;
